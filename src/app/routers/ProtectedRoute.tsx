import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/entities/auth/model/store"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Loader } from "@/shared/ui/loader"
import { ModerationStatusScreen } from "@/features/auth/ui/ModerationStatusScreen"

export const ProtectedRoute = () => {
  const { session, initialized, profile, loading } = useAuthStore()

  if (loading || !initialized) {
    return <Loader message="Проверка сессии..." />
  }

  if (!session) {
    return <Navigate to="/signin" replace />
  }

  const isCreateProfilePage = location.pathname === "/createProfile"

  if (session && !profile && !isCreateProfilePage) {
    return <Navigate to="/createProfile" replace />
  }

  if (!profile && isCreateProfilePage) {
    return <Outlet />
  }

  const isDoctorOrClinic =
    profile?.role === USER_ROLES.DOCTOR || profile?.role === USER_ROLES.CLINIC

  if (isDoctorOrClinic && profile?.moderation_status !== "approved") {
    return <ModerationStatusScreen />
  }

  return <Outlet />
}
