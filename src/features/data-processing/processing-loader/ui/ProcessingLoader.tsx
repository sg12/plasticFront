import { Sparkles, Loader2 } from "lucide-react"

export const ProcessingLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping">
          <div className="h-24 w-24 rounded-full bg-violet-400/20" />
        </div>
        <div className="relative rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-6 shadow-lg shadow-violet-500/30">
          <Sparkles className="size-12 animate-pulse text-white" />
        </div>
      </div>

      <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
        AI обрабатывает ваше фото
      </h2>


      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="size-4 animate-spin" />
        <span>Обычно занимает 15-30 секунд</span>
      </div>
    </div>
  )
}
