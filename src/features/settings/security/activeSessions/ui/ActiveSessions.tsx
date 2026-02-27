import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Monitor, LogOut } from "lucide-react"
import { useActiveSessions } from "@/features/activeSessions/hooks/useActiveSessions"
import { useAuthStore } from "@/entities/auth/model/auth.store"

export const ActiveSessions = () => {
  const { session, isLoading } = useActiveSessions()
  const { signOut } = useAuthStore()

  if (isLoading) {
    return (
      <div className="space-child">
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {session && (
        <div className="flex items-center justify-between rounded-lg border bg-green-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Monitor className="h-5 w-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{session.userAgent || "Текущее устройство"}</p>
              <p className="text-muted-foreground text-sm">Текущая сессия</p>
            </div>
          </div>
          <div className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
        </div>
      )}

      <div className="space-y-2">
        <Button
          variant="danger"
          size="sm"
          onClick={() => signOut("global")}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? "Выход..." : "Выйти со всех устройств"}
        </Button>
        <p className="text-muted-foreground text-xs">
          При выходе со всех устройств вам потребуется заново войти в аккаунт на каждом устройстве.
        </p>
      </div>
    </div>
  )
}
