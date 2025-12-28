import type { FallbackProps } from "react-error-boundary"
import { Button } from "@/shared/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate()

  console.error("Error Boundary caught an error:", error)

  const handleGoHome = () => {
    navigate("/main")
    resetErrorBoundary()
  }

  const handleRetry = () => {
    resetErrorBoundary()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Произошла ошибка</AlertTitle>
          <AlertDescription>
            Приложение столкнулось с неожиданной ошибкой. Вы можете попробовать перезагрузить
            страницу или вернуться на главную.
          </AlertDescription>
        </Alert>

        {import.meta.env.DEV && (
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
            <p className="text-destructive mb-2 text-sm font-semibold">
              Детали ошибки (только в режиме разработки):
            </p>
            <pre className="text-destructive max-h-48 overflow-auto text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="default" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Попробовать снова
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}
