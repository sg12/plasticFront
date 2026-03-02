import type { BodyZone, OperationType } from "../types/types"
import { BODY_ZONES } from "../model/constants"
import { supabase } from "@/shared/api/supabase/client"
import { logger } from "@/shared/lib/logger"

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
    logger.info("Начало обработки изображения через API V2", {
      zone,
      operationType,
      hasDescription: !!description,
      imageSize: image.size,
      imageType: image.type,
    })

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

    // Вызываем Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("router-ai", {
      body: {
        image: base64Image,
        mimeType,
        zone,
        operationType,
        description,
        editPrompt,
      },
    })

    if (error) {
      throw new Error(error.message || "Ошибка обработки изображения")
    }

    if (!data || !data.resultUrl) {
      logger.error(
        "Не удалось получить обработанное изображение",
        new Error("No resultUrl in response"),
        {
          zone,
          operationType,
        },
      )
      throw new Error("Не удалось получить обработанное изображение")
    }

    logger.info("Изображение успешно обработано через API V2", {
      zone,
      operationType,
      tokensUsed: data.tokensUsed,
    })

    return {
      resultUrl: data.resultUrl,
      tokensUsed: data.tokensUsed,
    }
  } catch (error) {
    logger.error("Ошибка обработки изображения с помощью API V2", error as Error, {
      zone,
      operationType,
    })
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Произошла ошибка при обработке изображения")
  }
}
