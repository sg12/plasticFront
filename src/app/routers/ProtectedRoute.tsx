import { Navigate, Outlet, useLocation } from "react-router"
import { MODERATION_STATUS, USER_ROLE } from "@/entities/user/model/user.constants"
import { Loader } from "@/shared/ui/loader"
import { ModerationStatusScreen } from "@/features/auth/ui/ModerationStatusScreen"
import { ROUTES } from "@/shared/model/routes"
import { useMe } from "@/entities/user/api/user.queries"
import { useAuthStore } from "@/entities/auth/model/auth.store"

export const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => !!state.token)
  const { data: user, isLoading } = useMe();
  const location = useLocation()

  if (isLoading) {
    return <Loader message="Проверка сессии..." />
  }

  if (!isAuth) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />
  }

  const isCreateProfilePage = location.pathname === ROUTES.CREATE_PROFILE

  if (!user && !isCreateProfilePage) {
    return <Navigate to={ROUTES.CREATE_PROFILE} replace />
  }

  if (!user && isCreateProfilePage) {
    return <Outlet />
  }

  const isDoctorOrClinic =
    user?.role === USER_ROLE.DOCTOR || user?.role === USER_ROLE.CLINIC

  const isApproved = user?.status === MODERATION_STATUS.APPROVED;

  if (isDoctorOrClinic && !isApproved) {
    return <ModerationStatusScreen />
  }

  return <Outlet />
}
