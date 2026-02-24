import { Navigate, Outlet, useLocation } from "react-router"
import { useAuthStore } from "@/entities/auth/model/auth.store"
import { MODERATION_STATUS, USER_ROLES } from "@/entities/user/model/user.constants"
import { Loader } from "@/shared/ui/loader"
import { ModerationStatusScreen } from "@/features/auth/ui/ModerationStatusScreen"
import { ROUTES } from "@/shared/model/routes"
import { useUserStore } from "@/entities/user/model/user.store"

export const ProtectedRoute = () => {
  const { session, initialized, loading } = useAuthStore()
  const { profile } = useUserStore()
  const location = useLocation()

  if (loading || !initialized) {
    return <Loader message="Проверка сессии..." />
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGNIN} replace />
  }

  const isCreateProfilePage = location.pathname === ROUTES.CREATE_PROFILE

  if (!initialized) return

  if (session && !profile && !isCreateProfilePage) {
    return <Navigate to={ROUTES.CREATE_PROFILE} replace />
  }

  if (!profile && isCreateProfilePage) {
    return <Outlet />
  }

  const isDoctorOrClinic =
    profile?.role === USER_ROLES.DOCTOR || profile?.role === USER_ROLES.CLINIC

  if (isDoctorOrClinic && profile?.moderationStatus !== MODERATION_STATUS.APPROVED) {
    return <ModerationStatusScreen />
  }

  return <Outlet />
}
