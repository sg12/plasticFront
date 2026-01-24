import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/entities/auth/model/store"
import { ROUTES } from "@/shared/model/routes"

export const PublicRoute = () => {
  const { session } = useAuthStore()

  if (session) {
    return <Navigate to={ROUTES.MAIN} replace />
  }

  return <Outlet />
}
