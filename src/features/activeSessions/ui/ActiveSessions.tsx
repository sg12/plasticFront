import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Monitor, LogOut, RefreshCw } from "lucide-react"
import { useActiveSessions } from "../hooks/useActiveSessions"

export const ActiveSessions = () => {
  const { session, isLoading, isSigningOut, signOutAll, refresh } = useActiveSessions()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {session && (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Monitor className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">{session.userAgent}</p>
              <p className="text-sm text-gray-500">
                Текущая сессия
                {session.expiresAt && (
                  <> · Истекает {session.expiresAt.toLocaleDateString("ru-RU")}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
          <RefreshCw className="h-4 w-4" />
          Обновить
        </Button>
        <Button variant="destructive" size="sm" onClick={signOutAll} disabled={isSigningOut}>
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Выход..." : "Выйти со всех устройств"}
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        При выходе со всех устройств вам потребуется заново войти в аккаунт на каждом устройстве.
      </p>
    </div>
  )
}
