import { useNavigate } from "react-router"
import { Button } from "@/shared/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import { ROUTES } from "@/shared/model/routes"

export const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(ROUTES.MAIN)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="space-global text-center">
            <div className="bg-destructive/10 mx-auto flex size-16 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive size-8" />
            </div>

            <div className="space-child">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <h2 className="text-xl font-semibold text-gray-700">Страница не найдена</h2>
            </div>

            <Alert>
              <AlertTitle>Маршрут не существует</AlertTitle>
              <AlertDescription>
                Запрашиваемая страница не существует или была перемещена. Проверьте URL или
                вернитесь на главную страницу.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button onClick={handleGoHome} variant="primary" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                На главную
              </Button>
              <Button onClick={handleGoBack} variant="secondary" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
