import { useState, useRef, useCallback } from "react"
import type { BodyZone } from "@/features/aiVisualization/types/types"
import { BODY_ZONES } from "@/features/aiVisualization/model/constants"
import { Button } from "@/shared/ui/button"
import { Download, RotateCcw, GripVertical } from "lucide-react"

interface ResultComparisonProps {
  selectedZone: BodyZone
  originalImage: string
  resultImage: string
  onReset: () => void
}

export const ResultComparison = ({
  selectedZone,
  originalImage,
  resultImage,
  onReset,
}: ResultComparisonProps) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const zone = BODY_ZONES[selectedZone]

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    },
    [isDragging, handleMove],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX)
    },
    [handleMove],
  )

  const handleDownload = async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (ctx) {
        ctx.drawImage(img, 0, 0)

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = `${Math.max(16, img.width / 30)}px Arial`
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"

        const watermarkText = "AI Визуализация • novome.ru"
        const padding = 20
        ctx.fillText(watermarkText, img.width - padding, img.height - padding)

        const link = document.createElement("a")
        link.download = `ai-visualization-${zone.id}-${Date.now()}.jpg`
        link.href = canvas.toDataURL("image/jpeg", 0.9)
        link.click()
      }
    }

    img.src = resultImage
  }

  return (
    <div className="space-global">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Результат готов!</h2>
        <p className="text-gray-500">
          Визуализация: <span className="font-medium text-violet-600">{zone.procedureName}</span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-lg cursor-ew-resize overflow-hidden rounded-2xl bg-gray-100 shadow-lg select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={resultImage}
          alt="После"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
          <img
            src={originalImage}
            alt="До"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
              maxWidth: "none",
            }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <GripVertical className="size-5 text-gray-400" />
          </div>
        </div>

        <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          До
        </div>
        <div className="absolute top-4 right-4 rounded-full bg-violet-600/90 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          После
        </div>

        <div className="absolute right-4 bottom-4 rounded-full bg-white/80 px-3 py-1.5 text-xs text-gray-600 backdrop-blur-sm">
          AI Визуализация
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">Перетащите слайдер для сравнения</p>

      <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
        <Button variant="secondary" className="flex-1" onClick={() => handleDownload()}>
          <Download className="mr-2 size-4" />
          Скачать
        </Button>

        <Button variant="secondary" className="flex-1" onClick={() => onReset()}>
          <RotateCcw className="mr-2 size-4" />
          Заново
        </Button>
      </div>

      <p className="mx-auto max-w-md text-center text-xs text-gray-400">
        Результат визуализации носит ознакомительный характер и не является гарантией реального
        результата операции. Точный прогноз возможен только после консультации с хирургом.
      </p>
    </div>
  )
}
