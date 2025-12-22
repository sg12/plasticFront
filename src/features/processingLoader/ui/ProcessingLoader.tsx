import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PROCESSING_MESSAGES } from '../model/constants';

export const ProcessingLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping">
          <div className="w-24 h-24 rounded-full bg-violet-400/20" />
        </div>
        <div className="relative p-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
          <Sparkles className="size-12 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        AI обрабатывает ваше фото
      </h2>

      <p className="text-gray-500 mb-8 h-6 transition-opacity duration-300">
        {PROCESSING_MESSAGES[messageIndex]}
      </p>

      <div className="w-full max-w-md mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {Math.round(progress)}% завершено
      </p>

      <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="size-4 animate-spin" />
        <span>Обычно занимает 15-30 секунд</span>
      </div>
    </div>
  );
};

