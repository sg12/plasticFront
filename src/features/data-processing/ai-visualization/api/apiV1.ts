import { FaceMesh } from "@mediapipe/face_mesh"
import type { OperationType } from "../types/types"

export type FaceZone = "nose" | "eyes" | "lips" | "cheeks" | "chin" | "forehead" | "ears"

const ZONE_LANDMARKS = {
  nose: {
    bridge: [6, 51, 4, 5],
    tip: [1, 2, 5, 4],
    nostrils: [31, 35, 168, 197, 195, 98, 327],
    sides: [131, 134, 102, 49, 220, 305, 290, 305],
  },
  lips: {
    upper: [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318],
    lower: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324],
    corners: [61, 291],
    center: [13, 14],
  },
  eyes: {
    leftUpper: [159, 160, 161, 246, 7, 163, 144, 145, 153, 154, 155, 133],
    leftLower: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158],
    rightUpper: [386, 387, 388, 466, 263, 362, 382, 381, 380, 374, 373, 390],
    rightLower: [263, 362, 382, 381, 380, 374, 373, 390, 466, 388, 387, 386],
  },
  chin: {
    tip: [152, 175, 199, 175, 18],
    jaw: [172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323],
  },
  cheeks: {
    left: [116, 117, 118, 119, 120, 121, 126, 142, 36, 205, 206, 207, 213, 192, 147],
    right: [345, 346, 347, 348, 349, 350, 451, 452, 265, 336, 296, 334, 293, 300, 276],
  },
  forehead: {
    center: [10, 151, 337, 299, 333, 298, 301, 368, 264, 447, 366, 401, 435, 410, 454],
    brows: [107, 55, 65, 52, 53, 46, 336, 296, 334, 293, 300, 276],
  },
  ears: {
    left: [234, 127, 162, 21, 54, 103, 67, 109],
    right: [454, 356, 389, 251, 284, 332, 297, 338],
  },
}

interface Params {
  image: File
  zone: FaceZone
  operationType: OperationType | null
  intensity: number
  description?: string
}

const averagePoint = (points: any[]) => {
  const sum = points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 })
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  }
}

const fileToImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const detectLandmarks = (faceMesh: FaceMesh, image: HTMLImageElement): Promise<any[] | null> => {
  return new Promise((resolve) => {
    faceMesh.onResults((res) => {
      resolve(res.multiFaceLandmarks?.[0] ?? null)
    })

    faceMesh.send({ image })
  })
}

const bilinearInterpolate = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
): [number, number, number, number] => {
  const x1 = Math.floor(x)
  const y1 = Math.floor(y)
  const x2 = Math.min(x1 + 1, width - 1)
  const y2 = Math.min(y1 + 1, height - 1)

  const fx = x - x1
  const fy = y - y1

  const getPixel = (px: number, py: number) => {
    const idx = (py * width + px) * 4
    return [data[idx] || 0, data[idx + 1] || 0, data[idx + 2] || 0, data[idx + 3] || 0]
  }

  const p11 = getPixel(x1, y1)
  const p21 = getPixel(x2, y1)
  const p12 = getPixel(x1, y2)
  const p22 = getPixel(x2, y2)

  // Билинейная интерполяция
  const interpolate = (a: number, b: number, c: number, d: number) => {
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
  }

  return [
    Math.round(interpolate(p11[0], p21[0], p12[0], p22[0])),
    Math.round(interpolate(p11[1], p21[1], p12[1], p22[1])),
    Math.round(interpolate(p11[2], p21[2], p12[2], p22[2])),
    Math.round(interpolate(p11[3], p21[3], p12[3], p22[3])),
  ]
}

// Функция для применения деформации с несколькими контрольными точками одновременно
// Использует forward mapping с билинейной интерполяцией для более качественного результата
const applyMultiPointLiquify = (
  ctx: CanvasRenderingContext2D,
  points: Array<{
    x: number
    y: number
    radius: number
    strength: number
    direction: "in" | "out"
  }>,
) => {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  const newData = new Uint8ClampedArray(w * h * 4)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w
      const ny = y / h

      let totalDx = 0
      let totalDy = 0
      let totalWeight = 0

      for (const point of points) {
        const dx = nx - point.x
        const dy = ny - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist <= point.radius) {
          const normalizedDist = dist / point.radius
          const weight = Math.pow(1 - normalizedDist, 3)
          const pull = weight * point.strength * (point.direction === "in" ? -1 : 1)

          const angle = Math.atan2(dy, dx)
          const newDist = dist * (1 + pull)
          const srcX = point.x + Math.cos(angle) * newDist
          const srcY = point.y + Math.sin(angle) * newDist

          totalDx += (srcX - nx) * weight
          totalDy += (srcY - ny) * weight
          totalWeight += weight
        }
      }

      let srcX = nx
      let srcY = ny

      if (totalWeight > 0) {
        srcX = nx + totalDx / totalWeight
        srcY = ny + totalDy / totalWeight
      }

      const srcPixelX = srcX * w
      const srcPixelY = srcY * h

      const [r, g, b, a] = bilinearInterpolate(data, w, h, srcPixelX, srcPixelY)

      const dstIdx = (y * w + x) * 4
      newData[dstIdx] = r
      newData[dstIdx + 1] = g
      newData[dstIdx + 2] = b
      newData[dstIdx + 3] = a
    }
  }

  ctx.putImageData(new ImageData(newData, w, h), 0, 0)
}

const applyZoneDeformation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  zone: FaceZone,
  operationType: OperationType | null,
  intensity: number,
) => {
  const factor = intensity / 100

  switch (zone) {
    case "nose":
      applyNoseOperation(ctx, landmarks, operationType, factor)
      break
    case "lips":
      applyLipsOperation(ctx, landmarks, operationType, factor)
      break
    case "eyes":
      applyEyesOperation(ctx, landmarks, operationType, factor)
      break
    case "chin":
      applyChinOperation(ctx, landmarks, operationType, factor)
      break
    case "cheeks":
      applyCheeksOperation(ctx, landmarks, operationType, factor)
      break
    case "forehead":
      applyForeheadOperation(ctx, landmarks, operationType, factor)
      break
    case "ears":
      applyEarsOperation(ctx, landmarks, operationType, factor)
      break
  }
}

const applyNoseOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.nose
  const tip = averagePoint(zone.tip.map((i) => landmarks[i]))
  const bridge = averagePoint(zone.bridge.map((i) => landmarks[i]))

  switch (operationType) {
    case "reduce":
      // Уменьшение носа - используем множественные точки для более естественного эффекта
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.18, strength: factor * 1.2, direction: "in" },
        { x: bridge.x, y: bridge.y, radius: 0.15, strength: factor * 0.9, direction: "in" },
      ])
      break
    case "refine":
      // Утончение - сжатие по бокам с множественными точками
      const nostrils = zone.nostrils.map((i) => landmarks[i])
      const refinePoints = nostrils.map((point) => ({
        x: point.x,
        y: point.y,
        radius: 0.12,
        strength: factor * 1.0,
        direction: "in" as const,
      }))
      applyMultiPointLiquify(ctx, refinePoints)
      break
    case "straighten":
      // Выпрямление - поднятие горбинки
      if (bridge.y < tip.y) {
        applyMultiPointLiquify(ctx, [
          { x: bridge.x, y: bridge.y, radius: 0.15, strength: factor * 0.9, direction: "out" },
        ])
      }
      break
    case "lift-tip":
      // Поднятие кончика
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.15, strength: factor * 1.0, direction: "out" },
      ])
      break
    default:
      // По умолчанию - уменьшение
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.18, strength: factor * 1.2, direction: "in" },
        { x: bridge.x, y: bridge.y, radius: 0.15, strength: factor * 0.9, direction: "in" },
      ])
  }
}

const applyLipsOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.lips
  const upperCenter = averagePoint(zone.upper.map((i) => landmarks[i]))
  const lowerCenter = averagePoint(zone.lower.map((i) => landmarks[i]))
  const center = averagePoint([upperCenter, lowerCenter])

  switch (operationType) {
    case "increase":
      // Увеличение губ - расширение наружу с множественными точками
      applyMultiPointLiquify(ctx, [
        {
          x: upperCenter.x,
          y: upperCenter.y,
          radius: 0.16,
          strength: factor * 1.3,
          direction: "out",
        },
        {
          x: lowerCenter.x,
          y: lowerCenter.y,
          radius: 0.16,
          strength: factor * 1.3,
          direction: "out",
        },
      ])
      break
    case "reduce":
      // Уменьшение губ - сжатие внутрь
      applyMultiPointLiquify(ctx, [
        { x: center.x, y: center.y, radius: 0.18, strength: factor * 1.1, direction: "in" },
      ])
      break
    case "reshape":
      // Изменение формы - корректировка контура
      applyMultiPointLiquify(ctx, [
        {
          x: upperCenter.x,
          y: upperCenter.y,
          radius: 0.14,
          strength: factor * 0.9,
          direction: "out",
        },
      ])
      break
    default:
      // По умолчанию - увеличение
      applyMultiPointLiquify(ctx, [
        {
          x: upperCenter.x,
          y: upperCenter.y,
          radius: 0.16,
          strength: factor * 1.3,
          direction: "out",
        },
        {
          x: lowerCenter.x,
          y: lowerCenter.y,
          radius: 0.16,
          strength: factor * 1.3,
          direction: "out",
        },
      ])
  }
}

const applyEyesOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.eyes
  const leftUpper = averagePoint(zone.leftUpper.map((i) => landmarks[i]))
  const rightUpper = averagePoint(zone.rightUpper.map((i) => landmarks[i]))
  const leftLower = averagePoint(zone.leftLower.map((i) => landmarks[i]))
  const rightLower = averagePoint(zone.rightLower.map((i) => landmarks[i]))

  switch (operationType) {
    case "upper-lift":
      // Поднятие верхних век с множественными точками
      applyMultiPointLiquify(ctx, [
        { x: leftUpper.x, y: leftUpper.y, radius: 0.14, strength: factor * 1.0, direction: "out" },
        {
          x: rightUpper.x,
          y: rightUpper.y,
          radius: 0.14,
          strength: factor * 1.0,
          direction: "out",
        },
      ])
      break
    case "lower-lift":
      // Подтяжка нижних век
      applyMultiPointLiquify(ctx, [
        { x: leftLower.x, y: leftLower.y, radius: 0.14, strength: factor * 0.9, direction: "out" },
        {
          x: rightLower.x,
          y: rightLower.y,
          radius: 0.14,
          strength: factor * 0.9,
          direction: "out",
        },
      ])
      break
    case "widen":
      // Расширение разреза глаз
      applyMultiPointLiquify(ctx, [
        { x: leftUpper.x, y: leftUpper.y, radius: 0.12, strength: factor * 0.8, direction: "out" },
        {
          x: rightUpper.x,
          y: rightUpper.y,
          radius: 0.12,
          strength: factor * 0.8,
          direction: "out",
        },
      ])
      break
    default:
      // По умолчанию - поднятие верхних век
      applyMultiPointLiquify(ctx, [
        { x: leftUpper.x, y: leftUpper.y, radius: 0.14, strength: factor * 1.0, direction: "out" },
        {
          x: rightUpper.x,
          y: rightUpper.y,
          radius: 0.14,
          strength: factor * 1.0,
          direction: "out",
        },
      ])
  }
}

const applyChinOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.chin
  const tip = averagePoint(zone.tip.map((i) => landmarks[i]))

  switch (operationType) {
    case "reduce":
      // Уменьшение подбородка
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.18, strength: factor * 1.1, direction: "in" },
      ])
      break
    case "augment":
      // Увеличение подбородка
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.18, strength: factor * 1.2, direction: "out" },
      ])
      break
    case "reshape":
      // Изменение формы
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.14, strength: factor * 0.9, direction: "out" },
      ])
      break
    default:
      // По умолчанию - уменьшение
      applyMultiPointLiquify(ctx, [
        { x: tip.x, y: tip.y, radius: 0.18, strength: factor * 1.1, direction: "in" },
      ])
  }
}

const applyCheeksOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.cheeks
  const left = averagePoint(zone.left.map((i) => landmarks[i]))
  const right = averagePoint(zone.right.map((i) => landmarks[i]))

  switch (operationType) {
    case "augment":
      // Увеличение скул
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.16, strength: factor * 1.1, direction: "out" },
        { x: right.x, y: right.y, radius: 0.16, strength: factor * 1.1, direction: "out" },
      ])
      break
    case "reduce":
      // Уменьшение щек
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.18, strength: factor * 1.0, direction: "in" },
        { x: right.x, y: right.y, radius: 0.18, strength: factor * 1.0, direction: "in" },
      ])
      break
    case "lift":
      // Подтяжка скул
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.14, strength: factor * 0.9, direction: "out" },
        { x: right.x, y: right.y, radius: 0.14, strength: factor * 0.9, direction: "out" },
      ])
      break
    default:
      // По умолчанию - увеличение
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.16, strength: factor * 1.1, direction: "out" },
        { x: right.x, y: right.y, radius: 0.16, strength: factor * 1.1, direction: "out" },
      ])
  }
}

const applyForeheadOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.forehead
  const center = averagePoint(zone.center.map((i) => landmarks[i]))

  switch (operationType) {
    case "smooth":
      // Разглаживание морщин
      applyMultiPointLiquify(ctx, [
        { x: center.x, y: center.y, radius: 0.2, strength: factor * 0.8, direction: "in" },
      ])
      break
    case "lift":
      // Подтяжка лба
      applyMultiPointLiquify(ctx, [
        { x: center.x, y: center.y, radius: 0.18, strength: factor * 0.9, direction: "out" },
      ])
      break
    case "reduce":
      // Уменьшение выступающего лба
      applyMultiPointLiquify(ctx, [
        { x: center.x, y: center.y, radius: 0.18, strength: factor * 1.0, direction: "in" },
      ])
      break
    default:
      // По умолчанию - разглаживание
      applyMultiPointLiquify(ctx, [
        { x: center.x, y: center.y, radius: 0.2, strength: factor * 0.8, direction: "in" },
      ])
  }
}

const applyEarsOperation = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  operationType: OperationType | null,
  factor: number,
) => {
  const zone = ZONE_LANDMARKS.ears
  const left = averagePoint(zone.left.map((i) => landmarks[i]))
  const right = averagePoint(zone.right.map((i) => landmarks[i]))

  switch (operationType) {
    case "pin-back":
      // Прижатие ушей
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.14, strength: factor * 1.0, direction: "in" },
        { x: right.x, y: right.y, radius: 0.14, strength: factor * 1.0, direction: "in" },
      ])
      break
    case "reduce":
      // Уменьшение ушей
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.16, strength: factor * 1.1, direction: "in" },
        { x: right.x, y: right.y, radius: 0.16, strength: factor * 1.1, direction: "in" },
      ])
      break
    case "reshape":
      // Изменение формы
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.12, strength: factor * 0.8, direction: "out" },
        { x: right.x, y: right.y, radius: 0.12, strength: factor * 0.8, direction: "out" },
      ])
      break
    default:
      // По умолчанию - прижатие
      applyMultiPointLiquify(ctx, [
        { x: left.x, y: left.y, radius: 0.14, strength: factor * 1.0, direction: "in" },
        { x: right.x, y: right.y, radius: 0.14, strength: factor * 1.0, direction: "in" },
      ])
  }
}

export const processFaceImage = async ({
  image,
  zone,
  operationType,
  intensity,
}: Params): Promise<{ resultUrl: string }> => {
  const img = await fileToImage(image)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)

  // ===== MediaPipe FaceMesh =====
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  })

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
  })

  const landmarks = await detectLandmarks(faceMesh, img)
  if (!landmarks) {
    throw new Error("Лицо не обнаружено")
  }

  // ===== Деформация с учетом типа операции =====
  applyZoneDeformation(ctx, landmarks, zone, operationType, intensity)

  return {
    resultUrl: canvas.toDataURL("image/jpeg", 0.92),
  }
}
