import { Button } from "@/shared/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  error: string | Error | null
  title?: string
  onRetry?: () => void
  retryLabel?: string
  description?: string
}

export const ErrorState = ({
  error,
  title = "Произошла ошибка",
  onRetry,
  retryLabel = "Попробовать снова",
  description,
}: ErrorStateProps) => {
  const getErrorMessage = (): string => {
    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : "";

    if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
      return "Проблема с подключением к серверу. Проверьте ваше интернет-соединение.";
    }

    if (message.toLowerCase().includes("timeout")) {
      return "Превышено время ожидания. Попробуйте обновить страницу.";
    }

    return message
  }

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
        </div>
        <h3 className="text-destructive mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-1 text-sm">{getErrorMessage()}</p>
        {description && <p className="text-muted-foreground mb-4 text-xs">{description}</p>}
        {onRetry && (
          <Button onClick={onRetry} variant="secondary" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
