import { Navigate, Outlet, useLocation } from "react-router"
import { MODERATION_STATUS } from "@/entities/user/model/user.constants"
import { Loader } from "@/shared/ui/loader"
import { ModerationStatusScreen } from "@/features/auth/ui/ModerationStatusScreen"
import { ROUTES } from "@/shared/model/routes"
import { useMe } from "@/entities/user/api/user.queries"
import { useAuthStore } from "@/entities/auth/model/auth.store"
import type { User } from "@/entities/user/types/user.types"

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => !!state.token)
  const { data: user, isLoading, error } = useMe()
  const location = useLocation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverError = (error as any)?.response?.data
  const currentStatus = serverError?.status || user?.status

  const roleKey = user?.role?.toLowerCase() as keyof User | undefined
  const hasProfile = !!(user && roleKey && user[roleKey])

  if (isLoading) {
    return <Loader message="Проверка сессии..." />
  }

  if (!isAuth) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />
  }

  const isCreateProfilePage = location.pathname === ROUTES.CREATE_PROFILE

  const isRestricted = [
    MODERATION_STATUS.PENDING,
    MODERATION_STATUS.REJECTED,
    MODERATION_STATUS.BANNED
  ].includes(currentStatus)

  if (isRestricted) {
    return (
      <ModerationStatusScreen
        status={currentStatus}
        comment={serverError?.moderationComment || user?.moderationComment}
      />
    )
  }

  if (hasProfile && isCreateProfilePage) {
    return <Navigate to={ROUTES.MAIN} replace />
  }

  if (!hasProfile && !isCreateProfilePage) {
    return <Navigate to={ROUTES.CREATE_PROFILE} replace />
  }

  return <Outlet />
}
