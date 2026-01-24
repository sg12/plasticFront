/**
 * @fileoverview Виджет для управления клиниками врача
 *
 * Позволяет врачу:
 * - Просматривать список приглашений от клиник
 * - Принимать приглашения
 * - Отклонять приглашения
 * - Просматривать историю приглашений
 */

import { useDoctorClinics } from "@/features/doctor/hooks/useDoctorClinics"
import { useAcceptInvitation } from "@/features/doctor/hooks/useAcceptInvitation"
import { useRejectInvitation } from "@/features/doctor/hooks/useRejectInvitation"
import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { MembershipList } from "@/widgets/membershipList/ui/MembershipList"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alertDialog"
import {
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Loader,
  Check,
  X,
  ExternalLink,
  Calendar,
  Users,
} from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ROUTES } from "@/shared/model/routes"
import { Link } from "react-router"
import type { ClinicMembership } from "@/entities/user/types/invitations"

interface DoctorClinicsListProps {
  doctorId: string | undefined
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Ожидает ответа
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="h-3 w-3" />
          Принято
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Отклонено
        </Badge>
      )
    case "left":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          Покинул
        </Badge>
      )
    default:
      return null
  }
}

export const DoctorClinicsList = ({ doctorId }: DoctorClinicsListProps) => {
  const { clinics, isLoading, error, refresh } = useDoctorClinics(doctorId)
  const { acceptInvitationById, isAccepting } = useAcceptInvitation(doctorId, refresh)
  const { rejectInvitationById, isRejecting } = useRejectInvitation(doctorId, refresh)

  // Разделяем клиники на принятые, ожидающие и историю
  const acceptedClinics = clinics.filter((clinic) => clinic.status === "accepted")
  const pendingClinics = clinics.filter((clinic) => clinic.status === "pending")
  const historyClinics = clinics.filter(
    (clinic) => clinic.status !== "pending" && clinic.status !== "accepted",
  )

  const handleAccept = async (membershipId: string) => {
    await acceptInvitationById(membershipId)
  }

  const handleReject = async (membershipId: string) => {
    await rejectInvitationById(membershipId)
  }

  const renderAcceptedClinic = (membership: ClinicMembership) => {
    const clinic = membership.clinic
    if (!clinic) return null

    return (
      <Card
        key={membership.id}
        className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {clinic.legalName}
                    </h3>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Активная клиника
                    </Badge>
                  </div>
                  {clinic.actualAddress && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{clinic.actualAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {membership.acceptedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Принято:{" "}
                      {format(new Date(membership.acceptedAt), "dd MMMM yyyy", { locale: ru })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Вы являетесь сотрудником этой клиники</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-col">
              <Button variant="primary" asChild className="w-full sm:w-auto">
                <Link to={ROUTES.PROFILE_SOME_USER.replace(":userId", clinic.id)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Профиль клиники
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderClinicCard = (membership: ClinicMembership, isPending: boolean) => {
    const clinic = membership.clinic
    if (!clinic) return null

    return (
      <div
        key={membership.id}
        className="hover:bg-accent/50 flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">{clinic.legalName}</h4>
                {clinic.actualAddress && (
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{clinic.actualAddress}</span>
                  </div>
                )}
              </div>
            </div>
            {getStatusBadge(membership.status)}
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div>
              Приглашение отправлено:{" "}
              {format(new Date(membership.invitedAt), "dd MMMM yyyy 'в' HH:mm", { locale: ru })}
            </div>
            {membership.acceptedAt && (
              <div>
                Принято:{" "}
                {format(new Date(membership.acceptedAt), "dd MMMM yyyy 'в' HH:mm", { locale: ru })}
              </div>
            )}
          </div>

          {isPending && (
            <div className="flex flex-wrap gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="primary" disabled={isAccepting || isRejecting}>
                    <Check className="mr-2 h-4 w-4" />
                    Принять
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Принять приглашение?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите принять приглашение от клиники "{clinic.legalName}"?
                      После принятия вы станете сотрудником этой клиники.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleAccept(membership.id)}
                      disabled={isAccepting}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {isAccepting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Принятие...
                        </>
                      ) : (
                        "Принять"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="secondary" disabled={isAccepting || isRejecting}>
                    <X className="mr-2 h-4 w-4" />
                    Отклонить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Отклонить приглашение?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы уверены, что хотите отклонить приглашение от клиники "{clinic.legalName}"?
                      Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleReject(membership.id)}
                      disabled={isRejecting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isRejecting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Отклонение...
                        </>
                      ) : (
                        "Отклонить"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button size="sm" variant="ghost" asChild>
                <Link to={ROUTES.PROFILE_SOME_USER.replace(":userId", clinic.id)}>
                  Посмотреть профиль
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Объединяем pending и history для отображения
  const invitationsList = [...pendingClinics, ...historyClinics]

  // Кастомный контент для группировки приглашений
  const renderGroupedInvitations = () => {
    if (pendingClinics.length === 0 && historyClinics.length === 0) {
      return null
    }

    return (
      <div className="space-y-6">
        {pendingClinics.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">Новые приглашения</h3>
            <div className="space-y-4">
              {pendingClinics.map((clinic) => renderClinicCard(clinic, true))}
            </div>
          </div>
        )}

        {historyClinics.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">История приглашений</h3>
            <div className="space-y-4">
              {historyClinics.map((clinic) => renderClinicCard(clinic, false))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const acceptedClinicsContent =
    acceptedClinics.length > 0 ? (
      <div className="space-y-4">
        {acceptedClinics.map((clinic) => renderAcceptedClinic(clinic))}
      </div>
    ) : null

  return (
    <MembershipList
      memberships={invitationsList}
      isLoading={isLoading}
      error={error}
      title="Приглашения от клиник"
      titleIcon={Mail}
      renderContent={renderGroupedInvitations}
      emptyState={{
        icon: Mail,
        title: "У вас пока нет приглашений от клиник",
        description: "Когда клиника отправит вам приглашение, оно появится здесь",
      }}
      onRetry={refresh}
      skeletonCount={2}
      beforeList={acceptedClinicsContent}
    />
  )
}
