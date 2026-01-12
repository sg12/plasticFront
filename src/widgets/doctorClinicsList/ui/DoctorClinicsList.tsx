/**
 * @fileoverview Виджет для управления клиниками врача
 *
 * Позволяет врачу:
 * - Просматривать список приглашений от клиник
 * - Принимать приглашения
 * - Отклонять приглашения
 * - Просматривать историю приглашений
 */

import { useDoctorClinics } from "@/features/doctorManagement/hooks/useDoctorClinics"
import { useAcceptInvitation } from "@/features/doctorManagement/hooks/useAcceptInvitation"
import { useRejectInvitation } from "@/features/doctorManagement/hooks/useRejectInvitation"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
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
              <Button variant="default" asChild className="w-full sm:w-auto">
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
                  <Button size="sm" variant="default" disabled={isAccepting || isRejecting}>
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
                  <Button size="sm" variant="outline" disabled={isAccepting || isRejecting}>
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

  return (
    <div className="space-y-6">
      {/* Принятые клиники - выделенный блок */}
      {acceptedClinics.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Моя клиника</h2>
          <div className="space-y-4">
            {acceptedClinics.map((clinic) => renderAcceptedClinic(clinic))}
          </div>
        </div>
      )}

      {/* Приглашения и история */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600" />
            Приглашения от клиник
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : pendingClinics.length === 0 && historyClinics.length === 0 ? (
            <div className="py-8 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-muted-foreground">У вас пока нет приглашений от клиник</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Когда клиника отправит вам приглашение, оно появится здесь
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Активные приглашения */}
              {pendingClinics.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Новые приглашения</h3>
                  <div className="space-y-4">
                    {pendingClinics.map((clinic) => renderClinicCard(clinic, true))}
                  </div>
                </div>
              )}

              {/* История приглашений */}
              {historyClinics.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold">История приглашений</h3>
                  <div className="space-y-4">
                    {historyClinics.map((clinic) => renderClinicCard(clinic, false))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
