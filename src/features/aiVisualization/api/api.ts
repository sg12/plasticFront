import { supabase } from "@/shared/api/supabase/client"
import {
  validateFile,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
} from "@/shared/lib/fileValidation"

export interface AIProcessingParams {
  image: File
  zone: string
  intensity: number
}

export interface AIProcessingResult {
  resultUrl: string
  processingTime: number
}

// Режим mock - если явно включен (или если не можем определить провайдера)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"

// Конвертирует File в base64 data URI с валидацией
const fileToBase64 = async (file: File): Promise<string> => {
  // Валидируем файл перед конвертацией
  try {
    await validateFile(file, FILE_VALIDATION_CONFIGS.images)
  } catch (error) {
    if (isFileValidationError(error)) {
      throw new Error(`Ошибка валидации изображения: ${error.message}`)
    }
    throw error
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Ошибка чтения файла"))
    reader.readAsDataURL(file)
  })
}

// Координаты зон лица (в процентах от размера изображения)
// Предполагаем стандартное фото лица в анфас
interface ZoneMask {
  x: number // центр X (0-1)
  y: number // центр Y (0-1)
  width: number // ширина (0-1)
  height: number // высота (0-1)
  prompt: string
}

const ZONE_MASKS: Record<string, ZoneMask> = {
  forehead: {
    x: 0.5,
    y: 0.18,
    width: 0.5,
    height: 0.15,
    prompt: "smooth forehead, no wrinkles, natural skin texture",
  },
  eyes: {
    x: 0.5,
    y: 0.35,
    width: 0.6,
    height: 0.12,
    prompt: "beautiful eyes, refreshed look, no dark circles, natural appearance",
  },
  nose: {
    x: 0.5,
    y: 0.5,
    width: 0.25,
    height: 0.25,
    prompt: "refined nose, balanced proportions, natural bridge, harmonious shape",
  },
  cheeks: {
    x: 0.5,
    y: 0.55,
    width: 0.7,
    height: 0.2,
    prompt: "defined cheekbones, sculpted face, natural contour, youthful appearance",
  },
  lips: {
    x: 0.5,
    y: 0.72,
    width: 0.35,
    height: 0.1,
    prompt: "fuller lips, defined lip shape, natural plump, balanced proportions",
  },
  chin: {
    x: 0.5,
    y: 0.85,
    width: 0.4,
    height: 0.15,
    prompt: "refined chin, balanced jawline, defined contour, harmonious face shape",
  },
  ears: {
    x: 0.5,
    y: 0.45,
    width: 0.95,
    height: 0.25,
    prompt: "refined ear shape, balanced proportions, natural appearance",
  },
}

// Создаёт маску для выбранной зоны (белый = изменять)
const createZoneMask = async (imageBase64: string, zone: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      if (!ctx) {
        reject(new Error("Canvas context недоступен"))
        return
      }

      // Заполняем чёрным (не изменять)
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Получаем координаты зоны
      const zoneMask = ZONE_MASKS[zone]
      if (!zoneMask) {
        // Если зона не найдена, делаем маску на всё лицо
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.ellipse(
          canvas.width * 0.5,
          canvas.height * 0.45,
          canvas.width * 0.35,
          canvas.height * 0.45,
          0,
          0,
          Math.PI * 2,
        )
        ctx.fill()
      } else {
        // Рисуем белый эллипс в зоне (изменять)
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.ellipse(
          canvas.width * zoneMask.x,
          canvas.height * zoneMask.y,
          (canvas.width * zoneMask.width) / 2,
          (canvas.height * zoneMask.height) / 2,
          0,
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Размытие краёв для плавного перехода
        ctx.filter = "blur(20px)"
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = "none"
      }

      resolve(canvas.toDataURL("image/png"))
    }

    img.onerror = () => reject(new Error("Ошибка загрузки изображения"))
    img.src = imageBase64
  })
}

// Получаем промпт для зоны
const getPromptForZone = (zone: string, intensity: number): string => {
  const zoneMask = ZONE_MASKS[zone]
  const basePrompt = zoneMask?.prompt || "enhanced natural appearance"

  const strength =
    intensity > 70
      ? "significantly enhanced"
      : intensity > 40
        ? "moderately enhanced"
        : "subtly enhanced"

  return `professional portrait photo, ${strength} ${basePrompt}, photorealistic, high quality, detailed skin texture, maintaining natural look`
}

// Вызов Replicate через Supabase Edge Function
const callReplicateInpainting = async (
  imageBase64: string,
  zone: string,
  intensity: number,
): Promise<string> => {
  const maskBase64 = await createZoneMask(imageBase64, zone)
  const prompt = getPromptForZone(zone, intensity)

  const { data, error } = await supabase.functions.invoke("replicate", {
    body: {
      image: imageBase64,
      mask: maskBase64,
      prompt,
    },
  })

  if (error) {
    throw new Error(error.message || "Ошибка вызова Supabase функции replicate")
  }

  const resultUrl = (data as { resultUrl?: unknown } | null)?.resultUrl
  if (typeof resultUrl !== "string" || resultUrl.length === 0) {
    throw new Error("Replicate: не удалось получить URL результата")
  }

  return resultUrl
}

// Mock обработка с визуализацией зоны (валидация уже выполнена в fileToBase64)
const processImageMock = async (image: File, zone: string, intensity: number): Promise<string> => {
  const processingTime = 2000 + Math.random() * 2000
  await new Promise((resolve) => setTimeout(resolve, processingTime))

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error("Ошибка чтения файла"))

    reader.onload = () => {
      const img = new Image()

      img.onerror = () => reject(new Error("Ошибка загрузки изображения"))

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = img.width
        canvas.height = img.height

        if (!ctx) {
          reject(new Error("Canvas context недоступен"))
          return
        }

        ctx.drawImage(img, 0, 0)

        // Получаем координаты зоны
        const zoneMask = ZONE_MASKS[zone]
        const factor = intensity / 100

        if (zoneMask) {
          // Применяем эффект только к выбранной зоне
          const zoneX = canvas.width * (zoneMask.x - zoneMask.width / 2)
          const zoneY = canvas.height * (zoneMask.y - zoneMask.height / 2)
          const zoneW = canvas.width * zoneMask.width
          const zoneH = canvas.height * zoneMask.height

          // Получаем данные только зоны
          const imageData = ctx.getImageData(zoneX, zoneY, zoneW, zoneH)
          const data = imageData.data

          // Применяем улучшение
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            data[i] = Math.min(255, r + (255 - r) * 0.15 * factor)
            data[i + 1] = Math.min(255, g + (255 - g) * 0.12 * factor)
            data[i + 2] = Math.min(255, b + (255 - b) * 0.08 * factor)
          }

          ctx.putImageData(imageData, zoneX, zoneY)

          // Добавляем glow эффект на зону
          ctx.globalCompositeOperation = "soft-light"
          const gradient = ctx.createRadialGradient(
            canvas.width * zoneMask.x,
            canvas.height * zoneMask.y,
            0,
            canvas.width * zoneMask.x,
            canvas.height * zoneMask.y,
            (canvas.width * zoneMask.width) / 2,
          )
          gradient.addColorStop(0, `rgba(255, 220, 200, ${0.3 * factor})`)
          gradient.addColorStop(1, `rgba(255, 220, 200, 0)`)
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        resolve(canvas.toDataURL("image/jpeg", 0.92))
      }

      img.src = reader.result as string
    }

    reader.readAsDataURL(image)
  })
}

// Основная функция обработки изображения через AI
export const processImageWithAI = async (
  params: AIProcessingParams,
): Promise<AIProcessingResult> => {
  const startTime = Date.now()

  try {
    // Дополнительная валидация параметров
    if (!params.zone || !ZONE_MASKS[params.zone]) {
      throw new Error(`Недопустимая зона: ${params.zone}`)
    }

    if (params.intensity < 0 || params.intensity > 100) {
      throw new Error(`Интенсивность должна быть в диапазоне 0-100, получено: ${params.intensity}`)
    }

    let resultUrl: string

    if (USE_MOCK) {
      console.log("[AI Visualizer] Using mock mode (set VITE_AI_PROVIDER to enable AI)")
      // Валидация выполняется в fileToBase64 для mock режима тоже
      resultUrl = await processImageMock(params.image, params.zone, params.intensity)
    } else {
      const imageBase64 = await fileToBase64(params.image)

      console.log("[AI Visualizer] Using Replicate via Supabase Edge Function")
      resultUrl = await callReplicateInpainting(imageBase64, params.zone, params.intensity)
    }

    return {
      resultUrl,
      processingTime: Date.now() - startTime,
    }
  } catch (error) {
    console.error("[AI Visualizer] Error:", error)
    throw error
  }
}
