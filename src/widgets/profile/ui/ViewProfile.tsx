import { Skeleton } from "@/shared/ui/skeleton"
import { UserProfileCard } from "./UserProfileCard"
import { UserProfileView } from "./UserProfileView"
import { UserProfileHistory } from "./UserProfileHistory"
import { useViewProfile } from "@/features/profile/hooks/useViewProfile"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Card, CardContent } from "@/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
// import { AppointmentButton } from "@/features/appointments/ui/AppointmentButton"
import { USER_ROLE } from "@/entities/user/model/user.constants"

interface ViewProfileProps {
  userId: string
}

/**
 * Компонент для просмотра чужого профиля (только чтение)
 * Используется когда пользователь просматривает профиль другого пользователя
 */
export const ViewProfile = ({ userId }: ViewProfileProps) => {
  const { data: viewProfile, isLoading, isError } = useViewProfile(userId)

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

  if (isError || !viewProfile) {
    return (
      <div className="space-global">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{isError || "Профиль не найден"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const getProfileTitle = () => {
    if (viewProfile.role === USER_ROLE.CLINIC) return "Профиль клиники"
    if (viewProfile.role === USER_ROLE.DOCTOR) return "Профиль врача"
    return "Профиль пользователя"
  }

  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-3xl font-semibold">{getProfileTitle()}</h3>
          <p className="text-muted-foreground mt-2">
            Просмотр информации о профиле пользователя
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-child">
          <div className="flex justify-between items-start">
            <UserProfileCard
              user={viewProfile}
            />
            {/* {user?.role === USER_ROLE.PATIENT && (
              <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                <AppointmentButton
                  doctorId={viewProfile.role === USER_ROLE.DOCTOR ? viewProfile.id : null}
                  clinicId={viewProfile.role === USER_ROLE.CLINIC ? viewProfile.id : null}
                  className="max-md:w-full"
                />
              </div>
            )} */}
          </div>
          <Tabs defaultValue="information">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="information">Данные</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>
            <TabsContent value="information">
              <UserProfileView user={viewProfile} />
            </TabsContent>
            <TabsContent value="history">
              <UserProfileHistory user={viewProfile} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* {user?.role != USER_ROLE.PATIENT && (
        <div className="bg-background/90 h-[calc(100svh-var(--header-height))]!] fixed inset-x-0 bottom-(--header-height) bottom-0 z-10 border-t p-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-1">
            <AppointmentButton
              doctorId={viewProfile.role === USER_ROLE.DOCTOR ? viewProfile.id : null}
              clinicId={viewProfile.role === USER_ROLE.CLINIC ? viewProfile.id : null}
              className="max-md:w-full"
            />
          </div>
        </div>
      )} */}
    </div >
  )
}
