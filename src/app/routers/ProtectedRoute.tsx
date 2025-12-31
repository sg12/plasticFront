import { Label } from "@radix-ui/react-label"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Loader } from "lucide-react"
import { useAuthStore } from "@/entities/auth/model/store"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Button } from "@/shared/ui/button"

export const ProtectedRoute = () => {
  const { session, loading, profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/signin", { replace: true })
  }

  if (!session) {
    return <Navigate to="/signin" replace />
  }

  if (loading || !profile) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader role="status" aria-label="Loading" className="size-4 animate-spin" />
        <Label>Загрузка...</Label>
      </div>
    )
  }

  const isDoctorOrClinic =
    profile?.role === USER_ROLES.DOCTOR || profile?.role === USER_ROLES.CLINIC
  const isApproved = profile?.moderation_status === "approved"

  if (isDoctorOrClinic && !isApproved) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <div className="bg-background w-full max-w-md space-y-3 rounded-lg border p-6">
          <div className="text-lg font-semibold">Заявка на модерацию отправлена</div>
          <div className="text-muted-foreground text-sm">
            Мы проверяем данные и документы. Доступ к кабинету будет открыт после подтверждения.
          </div>
          <div className="text-sm">
            Статус: <span className="font-medium">{profile?.moderation_status}</span>
          </div>
          <div className="pt-2">
            <Button type="button" variant="outline" onClick={() => handleSignOut()}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}
