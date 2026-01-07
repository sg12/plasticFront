import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/entities/auth/model/store"

export const PublicRoute = () => {
  const { session } = useAuthStore()

  if (session) {
    return <Navigate to="/main" replace />
  }

  return <Outlet />
}
