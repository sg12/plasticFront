import { Navigate, Outlet } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { useAuth } from "@/entities/auth/api/auth.queries";
import { Loader } from "@/shared/ui/loader";

export const PublicRoute = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return <Loader message="Загрузка..." />
  }

  if (isAuth) {
    return <Navigate to={ROUTES.MAIN} replace />
  }

  return <Outlet />
}
