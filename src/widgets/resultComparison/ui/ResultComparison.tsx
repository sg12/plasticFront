import { useState, useRef, useCallback } from 'react';
import type { BodyZone } from '@/features/aiVisualization/types/types';
import { BODY_ZONES } from '@/features/aiVisualization/model/constants';
import { Button } from '@/shared/ui/button';
import { Download, RotateCcw, Share2, GripVertical } from 'lucide-react';

interface ResultComparisonProps {
  selectedZone: BodyZone;
  originalImage: string;
  resultImage: string;
  onReset: () => void;
  onBookConsultation?: () => void;
}

export const ResultComparison = ({
  selectedZone,
  originalImage,
  resultImage,
  onReset,
}: ResultComparisonProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const zone = BODY_ZONES[selectedZone];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleDownload = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = `${Math.max(16, img.width / 30)}px Arial`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        const watermarkText = 'AI Визуализация • novome.ru';
        const padding = 20;
        ctx.fillText(watermarkText, img.width - padding, img.height - padding);

        const link = document.createElement('a');
        link.download = `ai-visualization-${zone.id}-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      }
    };

    img.src = resultImage;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Визуализация',
          text: `Посмотрите мою визуализацию ${zone.description}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Результат готов!</h2>
        <p className="text-gray-500">
          Визуализация: <span className="font-medium text-violet-600">{zone.procedureName}</span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden cursor-ew-resize select-none bg-gray-100 shadow-lg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={resultImage}
          alt="После"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalImage}
            alt="До"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              maxWidth: 'none'
            }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <GripVertical className="size-5 text-gray-400" />
          </div>
        </div>

        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          До
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-violet-600/90 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          После
        </div>

        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 text-xs">
          AI Визуализация
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Перетащите слайдер для сравнения
      </p>

      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleDownload()}
        >
          <Download className="size-4 mr-2" />
          Скачать
        </Button>

        {!!navigator.share && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleShare()}
          >
            <Share2 className="size-4 mr-2" />
            Поделиться
          </Button>
        )}

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onReset()}
        >
          <RotateCcw className="size-4 mr-2" />
          Заново
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center max-w-md mx-auto">
        Результат визуализации носит ознакомительный характер и не является гарантией
        реального результата операции. Точный прогноз возможен только после консультации с хирургом.
      </p>
    </div>
  );
};

