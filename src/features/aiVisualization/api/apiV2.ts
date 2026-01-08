import type { BodyZone, OperationType } from "../types/types"
import { BODY_ZONES } from "../model/constants"

const API_BASE_URL = import.meta.env.VITE_ROUTERAI_URL || "https://routerai.ru/api/v1"
const API_KEY = import.meta.env.VITE_ROUTERAI_KEY

interface Params {
  image: File
  zone: BodyZone
  operationType: OperationType | null
  description?: string
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getImageMimeType = (file: File): string => {
  if (file.type) {
    return file.type
  }
  const ext = file.name.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "webp":
      return "image/webp"
    default:
      return "image/jpeg"
  }
}

/**
 * Обрабатывает изображение через RouterAI API (версия 2)
 * Использует GPT-4o Vision для анализа и Gemini 2.5 Flash Image для генерации результата
 *
 * @see https://routerai.ru/docs/guides - Документация RouterAI
 */
export const processFaceImageV2 = async ({
  image,
  zone,
  operationType,
  description,
}: Params): Promise<{ resultUrl: string; tokensUsed?: number }> => {
  try {
    // Валидация API ключа
    if (!API_KEY) {
      throw new Error(
        "API ключ RouterAI не настроен. Установите VITE_ROUTERAI_KEY в переменных окружения",
      )
    }

    // Валидация входных данных
    if (!image) {
      throw new Error("Изображение не предоставлено")
    }

    // Проверяем, что зона поддерживается
    const faceZones: BodyZone[] = ["nose", "eyes", "lips", "cheeks", "chin", "forehead", "ears"]
    if (!faceZones.includes(zone)) {
      throw new Error(`Зона "${zone}" не поддерживается для обработки лица`)
    }

    // Конвертируем изображение в base64
    const base64Image = await fileToBase64(image)
    const mimeType = getImageMimeType(image)

    // Получаем конфигурацию зоны
    const zoneConfig = BODY_ZONES[zone]

    // Создание промпта для редактирования изображения
    const operation = zoneConfig.operations?.find((op) => op.id === operationType)
    const operationDescription = operation?.description || ""
    const operationLabel = operation?.label || ""
    const additionalInstructions = description
      ? `\n\nДополнительные требования: ${description}`
      : ""

    const editPrompt = `Вы инструмент для редактирования изображений. Ваша задача - отредактировать предоставленное изображение, изменив ТОЛЬКО область ${zoneConfig.label}, сохранив все остальное без изменений.

Область для изменения: ${zoneConfig.label} (${zone})
Тип изменений: ${operationLabel} - ${operationDescription}${additionalInstructions}

КРИТИЧЕСКИ ВАЖНО:
- Вы ДОЛЖНЫ использовать именно это изображение как основу - не генерируйте новое изображение
- Сохраните ВСЕ черты лица: глаза, брови, форму лица, текстуру кожи, цвет волос, родинки, морщины - ВСЕ должно остаться идентичным
- Измените ТОЛЬКО область ${zoneConfig.label} согласно описанию: ${operationDescription}
- Сохраните освещение, фон, композицию и все оригинальные детали
- Результат должен быть отредактированной версией ЭТОГО изображения, а не новым сгенерированным изображением
- Полностью сохраните идентичность человека - это тот же человек, только с измененной указанной областью
- Примените изменения естественно и реалистично

Это инструмент визуализации для демонстрации возможных эстетических изменений. Отредактируйте это конкретное изображение, сохранив идентичность человека.`

    // Редактирование изображения через chat/completions с мультимодальностью
    // Отправляем исходное изображение вместе с промптом для редактирования
    try {
      const imageResponse = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
                {
                  type: "text",
                  text: editPrompt,
                },
              ],
            },
          ],
          modalities: ["image", "text"],
          max_tokens: 1000,
        }),
      })

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text()
        throw new Error(`Ошибка API генерации: ${imageResponse.status} ${errorText}`)
      }

      const responseData = await imageResponse.json()

      const message = responseData.choices?.[0]?.message
      if (!message) {
        throw new Error("Не удалось получить ответ от модели генерации изображений")
      }

      let imageUrl: string | null = null

      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageItem = message.images[0]
        if (imageItem.type === "image_url" && imageItem.image_url?.url) {
          imageUrl = imageItem.image_url.url
        } else if (imageItem.image) {
          imageUrl = imageItem.image
        }
      }

      if (!imageUrl && message.content) {
        const content = Array.isArray(message.content) ? message.content : [message.content]

        for (const item of content) {
          // Проверяем разные форматы ответа
          if (item && typeof item === "object") {
            if (item.type === "image_url" && item.image_url?.url) {
              imageUrl = item.image_url.url
              break
            } else if (item.type === "image" && item.image) {
              imageUrl = item.image
              break
            }
          } else if (typeof item === "string" && item.startsWith("data:image")) {
            imageUrl = item
            break
          }
        }
      }

      if (!imageUrl) {
        throw new Error("Не удалось найти изображение в ответе API")
      }

      if (imageUrl.startsWith("data:image")) {
        return {
          resultUrl: imageUrl,
        }
      }

      const imageBlob = await fetch(imageUrl).then((res) => res.blob())
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(imageBlob)
      })

      return {
        resultUrl: imageDataUrl,
      }
    } catch (generationError) {
      console.error("Ошибка генерации изображения:", generationError)
      if (generationError instanceof Error) {
        throw new Error(`Ошибка генерации изображения: ${generationError.message}`)
      }
      throw new Error("Не удалось сгенерировать изображение")
    }
  } catch (error) {
    console.error("Ошибка обработки изображения с помощью API V2:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Произошла ошибка при обработке изображения")
  }
}
