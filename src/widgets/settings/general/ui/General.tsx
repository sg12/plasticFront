import { ChangePassword } from "@/features/changePassword/ui/ChangePassword"
import { ActiveSessions } from "@/features/activeSessions/ui/ActiveSessions"
import { LoginHistory } from "@/features/loginHistory/ui/LoginHistory"
import { TimezoneSettings } from "@/features/localeSettings/ui/TimezoneSettings"
import { Lock, Monitor, History, Globe } from "lucide-react"

export const General = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2>Настройки</h2>
        <p className="mt-2 text-gray-600">Управление параметрами аккаунта и приложения</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <Lock className="h-5 w-5 text-purple-600" />
          <h3>Безопасность</h3>
        </div>
        <div className="space-y-3">
          <ChangePassword />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <Monitor className="h-5 w-5 text-purple-600" />
          <h3>Активные сессии</h3>
        </div>
        <ActiveSessions />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <History className="h-5 w-5 text-purple-600" />
          <h3>История входов</h3>
        </div>
        <LoginHistory />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <Globe className="h-5 w-5 text-purple-600" />
          <h3>Регион</h3>
        </div>
        <TimezoneSettings />
      </div>
    </div>
  )
}
