import { Navigate, Outlet } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { useAuthStore } from "@/entities/auth/model/auth.store";

export const PublicRoute = () => {
  const isAuth = useAuthStore((state) => !!state.token)

  if (isAuth) {
    return <Navigate to={ROUTES.MAIN} replace />
  }

  return <Outlet />
}
