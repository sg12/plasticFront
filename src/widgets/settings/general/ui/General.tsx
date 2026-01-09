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
      <div>
        <h2>Настройки</h2>
        <p className="mt-2 text-gray-600">Управление параметрами аккаунта и приложения</p>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-600" />
            <h4>Безопасность</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePassword />
        </CardContent>
      </Card> */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-purple-600" />
              <h4>Активные сессии</h4>
            </CardTitle>
            <CardAction>
              <Button variant="outline" size="icon" onClick={() => refresh()} disabled={isLoading}>
                <RefreshCw className={cn(isLoading && "animate-spin", "h-4 w-4")} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ActiveSessions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" />
              <h4>История входов</h4>
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
            <h4>Регион</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimezoneSettings />
        </CardContent>
      </Card>
    </div>
  )
}
