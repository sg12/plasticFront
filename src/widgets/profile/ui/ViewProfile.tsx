import { Skeleton } from "@/shared/ui/skeleton"
import { UserProfileCard } from "./UserProfileCard"
import { UserProfileView } from "./UserProfileView"
import { UserProfileHistory } from "./UserProfileHistory"
import { useViewProfile } from "../hooks/useViewProfile"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { USER_ROLES } from "@/entities/user/model/constants"
import { formatRole } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import type { UserRole } from "@/entities/user/types/types"

interface ViewProfileProps {
  userId: string
}

/**
 * Компонент для просмотра чужого профиля (только чтение)
 * Используется когда пользователь просматривает профиль другого пользователя
 */
export const ViewProfile = ({ userId }: ViewProfileProps) => {
  const { profile, isLoading, error } = useViewProfile(userId)

  if (isLoading) {
    return (
      <div className="space-global">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-global lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="space-global">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Профиль не найден"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const getProfileTitle = () => {
    if (profile.role === USER_ROLES.CLINIC) return "Профиль клиники"
    if (profile.role === USER_ROLES.DOCTOR) return "Профиль врача"
    return "Профиль пользователя"
  }

  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="min-w-0 truncate">{getProfileTitle()}</h2>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Просмотр информации о профиле пользователя
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UserProfileCard profile={profile} />
        </div>
        <div className="space-global lg:col-span-2">
          <UserProfileView profile={profile} />
          <UserProfileHistory profile={profile} />
        </div>
      </div>
    </div>
  )
}
