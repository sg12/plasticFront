import { useState, useRef, useCallback, useLayoutEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Download, RotateCcw, GripVertical } from "lucide-react"
import { ZONES_CONST } from "@/entities/ai-visualization/model/ai-visualization.constants"
import { useVisualizerStore } from "@/entities/ai-visualization/model/ai-visualization.store"

export const ResultComparison = () => {
    const {
        zone,
        photoPreview,
        resultImage,
        reset
    } = useVisualizerStore()

    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)

    const [containerWidth, setContainerWidth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!containerRef.current) return

        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        // Инициализируем при монтировании
        updateWidth()

        // Слушаем изменения размера (например, при повороте экрана или ресайзе окна)
        const observer = new ResizeObserver(updateWidth)
        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [])

    const zoneData = zone ? ZONES_CONST[zone as keyof typeof ZONES_CONST] : null

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
        setSliderPosition(percentage)
    }, [])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX)
    }

    const handleDownload = async () => {
        if (!resultImage) return

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
                ctx.font = `${Math.max(16, img.width / 30)}px sans-serif`
                ctx.textAlign = "right"
                ctx.fillText("AI Визуализация • novome.ru", img.width - 20, img.height - 20)

                const link = document.createElement("a")
                link.download = `result-${zone}-${Date.now()}.jpg`
                link.href = canvas.toDataURL("image/jpeg", 0.9)
                link.click()
            }
        }
        img.src = resultImage
    }

    if (!photoPreview || !resultImage) return null

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center">
                <h2 className="mb-1 text-2xl font-bold text-gray-900">Результат готов!</h2>
                <p className="text-sm text-gray-500">
                    Зона: <span className="font-semibold text-violet-600">{zoneData?.title}</span>
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative mx-auto aspect-square w-full max-w-lg cursor-ew-resize overflow-hidden rounded-2xl shadow-2xl select-none touch-none"
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
            >
                <img
                    src={resultImage}
                    alt="После"
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                />

                <div
                    className="absolute inset-0 z-10 overflow-hidden border-r border-white/20"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img
                        src={photoPreview}
                        alt="До"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                            width: containerWidth > 0 ? `${containerWidth}px` : '100%',
                            maxWidth: "none"
                        }}
                        draggable={false}
                    />
                </div>

                <div
                    className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                    style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                >
                    <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-violet-100">
                        <GripVertical className="size-5 text-violet-500" />
                    </div>
                </div>

                <div className="absolute top-4 left-4 z-30 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    До
                </div>
                <div className="absolute top-4 right-4 z-30 rounded-full bg-violet-600/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    После
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 italic">
                Потяните за центр, чтобы сравнить изменения
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" className="flex-1 gap-2" onClick={handleDownload}>
                    <Download className="size-4" />
                    Сохранить результат
                </Button>

                <Button variant="secondary" className="flex-1 gap-2" onClick={reset}>
                    <RotateCcw className="size-4" />
                    Попробовать снова
                </Button>
            </div>

            <div className="rounded-xl bg-amber-50 p-4 border border-amber-100">
                <p className="text-center text-[11px] leading-relaxed text-amber-700/80">
                    ⚠️ Результат визуализации сгенерирован ИИ и носит ознакомительный характер.
                    Реальный результат операции может отличаться и зависит от ваших индивидуальных особенностей.
                </p>
            </div>
        </div>
    )
}