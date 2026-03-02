/**
 * @fileoverview Универсальная карточка записи на приём
 *
 * Компонент отображает информацию о записи на приём для всех ролей:
 * - Пациент: показывает врача/клинику
 * - Врач: показывает пациента, может подтверждать и завершать записи
 * - Клиника: показывает врача и пациента, может подтверждать и завершать записи
 *
 * @module widgets/appointmentCard/ui/AppointmentCard
 */

import type { Appointment } from "@/entities/appointment/types/appointment.types"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardTitle, CardContent, CardFooter, CardAction } from "@/shared/ui/card"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar, Clock, X, User, Stethoscope, Hospital, Check, CheckCircle2, ExternalLink } from "lucide-react"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { cn } from "@/shared/lib/utils"
import { Link } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LOCALES } from "@/entities/appointment/model/appointment.constants"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import type { ROLE } from "@/entities/user/types/user.types"

interface AppointmentCardProps {
  appointment: Appointment
  userRole: ROLE
  onCancel?: (appointmentId: string) => void
  onConfirm?: (appointmentId: string) => void
  onComplete?: (appointmentId: string) => void
}

export const AppointmentCard = ({
  appointment,
  userRole,
  onCancel,
  onConfirm,
  onComplete,
}: AppointmentCardProps) => {
  const isMobile = useIsMobile()
  const appointmentDate = new Date(appointment.timeSlot.startAt)
  const now = new Date()
  const isPastOrToday = appointmentDate <= now

  const canCancel =
    appointment.status !== APPOINTMENT_STATUS.CANCELED &&
    appointment.status !== APPOINTMENT_STATUS.COMPLETED &&
    appointmentDate > new Date() &&
    onCancel

  const canConfirm = (userRole === USER_ROLE.DOCTOR || userRole === USER_ROLE.CLINIC) && appointment.status === APPOINTMENT_STATUS.PENDING && onConfirm

  const canComplete =
    (userRole === USER_ROLE.DOCTOR || userRole === USER_ROLE.CLINIC) &&
    appointment.status === APPOINTMENT_STATUS.CONFIRMED &&
    isPastOrToday &&
    onComplete

  const getHeaderInfo = () => {
    if (userRole === USER_ROLE.PATIENT) {
      if (appointment.doctorId) {
        return {
          icon: Stethoscope,
          label: "Врач",
          value: appointment.doctor.user.fullName,
          id: appointment.doctor.user.id
        }
      }
      if (appointment.clinicId) {
        return {
          icon: Hospital,
          label: "Клиника",
          value: appointment.clinic.brandName,
          id: appointment.clinic.user.id
        }
      }
    } else if (userRole === USER_ROLE.DOCTOR) {
      return {
        icon: User,
        label: "Пациент",
        value: appointment.patient.user.fullName,
        id: appointment.patient.user.id
      }
    } else if (userRole === USER_ROLE.CLINIC) {
      return {
        icon: User,
        label: "Пациент",
        value: appointment.patient.user.fullName,
        id: appointment.patient.user.id,
        secondary: appointment.doctorId
          ? {
            icon: Stethoscope,
            label: "Врач",
            value: appointment.doctor.user.fullName,
            id: appointment.doctor.user.id,
          }
          : null,
      }
    }
    return null
  }

  const headerInfo = getHeaderInfo()

  const actionButtons = (
    <>
      {canConfirm && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onConfirm(appointment.id)}
          className={cn(isMobile && "w-full")}
        >
          <Check className="h-4 w-4" />
          Подтвердить
        </Button>
      )}
      {canComplete && (
        <Button
          variant="success"
          size="sm"
          onClick={() => onComplete(appointment.id)}
          className={cn(isMobile && "w-full")}
        >
          <CheckCircle2 className="h-4 w-4" />
          Завершить
        </Button>
      )}
      {canCancel && (
        <Button
          variant={isMobile ? "danger" : "ghost"}
          size={isMobile ? "sm" : "iconMd"}
          onClick={() => onCancel(appointment.id)}
          className={cn(isMobile && "w-full")}
        >
          {!isMobile && <X className="h-4 w-4" />}
          {isMobile && "Отменить"}
        </Button>
      )}
    </>
  )

  const hasOutDate = (appointmentDate: Date) => {
    const time = (appointmentDate.getTime() - new Date().getTime())
    if (time < 0) { return <Badge variant="destructive">Дата истекла</Badge> }
  }

  return (
    <Card>
      <CardContent className={cn("flex items-start gap-4", isMobile && "flex-col")}>
        <div className="w-full min-w-0 flex-1">
          {headerInfo && (
            <CardTitle className="mb-2 flex items-center gap-2">
              <headerInfo.icon className="h-5 w-5 shrink-0" />
              <Link to={ROUTES.PROFILE_SOME_USER.replace(":userId", headerInfo.id || "")} target="_blank">
                {headerInfo.value}
              </Link>
              <ExternalLink className="size-3.5 text-muted-foreground" />
              {hasOutDate(appointmentDate)}
            </CardTitle>
          )}
          {headerInfo?.secondary && (
            <div className="text-muted-foreground mb-2 flex items-center gap-2">
              <headerInfo.secondary.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {headerInfo.secondary.label} {headerInfo.secondary.value}
              </span>
            </div>
          )}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {format(appointmentDate, "d MMMM yyyy, EEEE", { locale: ru })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              {format(appointment.timeSlot.startAt, "HH:mm")} - {format(appointment.timeSlot.endAt, "HH:mm")}
            </div>
            <Badge
              variant={
                appointment.status === APPOINTMENT_STATUS.CONFIRMED
                  ? "accent"
                  : appointment.status === APPOINTMENT_STATUS.CANCELED
                    ? "destructive"
                    : "secondary"
              }
            >
              {APPOINTMENT_STATUS_LOCALES[appointment.status].ru}
            </Badge>
          </div>
        </div>
        {!isMobile && <CardAction className="flex shrink-0 gap-2">{actionButtons}</CardAction>}
      </CardContent>
      {isMobile && (canConfirm || canComplete || canCancel) && (
        <CardFooter className="flex-col gap-2 pt-0">{actionButtons}</CardFooter>
      )}
      {(appointment.reason || appointment.notes) && (
        <CardFooter
          className={cn(
            "flex-col items-start",
            (canConfirm || canComplete || canCancel) && "border-t",
          )}
        >
          {appointment.reason && (
            <p className="text-muted-foreground mb-2">
              <strong>Причина:</strong> {appointment.reason}
            </p>
          )}
          {appointment.notes && (
            <p className="text-muted-foreground">
              <strong>Комментарий:</strong> {appointment.notes}
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
