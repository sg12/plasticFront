import { ActiveSessions } from "@/features/activeSessions/ui/ActiveSessions"
import { LoginHistory } from "@/features/loginHistory/ui/LoginHistory"
import { TimezoneSettings } from "@/features/localeSettings/ui/TimezoneSettings"
import { Monitor, History, Globe, RefreshCw } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { useActiveSessions } from "@/features/activeSessions/hooks/useActiveSessions"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"

export const General = () => {
  const { isLoading, refresh } = useActiveSessions()

  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="min-w-0 truncate">Основные настройки</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Управление параметрами аккаунта и приложения
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Активные сессии
              </CardTitle>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => refresh()}
                  disabled={isLoading}
                  aria-label="Обновить список сессий"
                >
                  <RefreshCw className={cn(isLoading && "animate-spin", "h-4 w-4")} />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <ActiveSessions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" />
              История входов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginHistory />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Регион и часовой пояс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimezoneSettings />
        </CardContent>
      </Card>
    </div>
  )
}
