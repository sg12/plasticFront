/**
 * @fileoverview Универсальная карточка записи на приём
 *
 * Компонент отображает информацию о записи на приём для всех ролей:
 * - Пациент: показывает врача/клинику
 * - Врач: показывает пациента
 * - Клиника: показывает врача и пациента
 *
 * @module widgets/appointmentCard/ui/AppointmentCard
 */

import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from "@/entities/appointments/model/constants"
import type { Appointment } from "@/entities/appointments/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import type { UserRole } from "@/entities/user/types/types"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardTitle, CardContent, CardFooter, CardAction } from "@/shared/ui/card"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar, Clock, X, User, Stethoscope, Hospital, Check, CheckCircle2 } from "lucide-react"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { cn } from "@/shared/lib/utils"

interface AppointmentCardProps {
  /** Запись на приём */
  appointment: Appointment
  /** Роль текущего пользователя */
  userRole: UserRole
  /** Обработчик отмены записи */
  onCancel?: (appointmentId: string) => void
  /** Обработчик подтверждения записи (только для врача) */
  onConfirm?: (appointmentId: string) => void
  /** Обработчик завершения записи (для врача и клиники) */
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
  const appointmentDate = new Date(appointment.dateTime)
  const now = new Date()
  const isPastOrToday = appointmentDate <= now

  const canCancel =
    appointment.status !== "cancelled" &&
    appointment.status !== "completed" &&
    appointmentDate > new Date() &&
    onCancel

  const canConfirm = userRole === USER_ROLES.DOCTOR && appointment.status === "pending" && onConfirm

  const canComplete =
    (userRole === USER_ROLES.DOCTOR || userRole === USER_ROLES.CLINIC) &&
    appointment.status === "confirmed" &&
    isPastOrToday &&
    onComplete

  const getHeaderInfo = () => {
    if (userRole === USER_ROLES.PATIENT) {
      if (appointment.doctorId) {
        return {
          icon: Stethoscope,
          label: "Врач",
          value: `#${appointment.doctorId.slice(0, 8)}`,
        }
      }
      if (appointment.clinicId) {
        return {
          icon: Hospital,
          label: "Клиника",
          value: `#${appointment.clinicId.slice(0, 8)}`,
        }
      }
    } else if (userRole === USER_ROLES.DOCTOR) {
      return {
        icon: User,
        label: "Пациент",
        value: `#${appointment.patientId.slice(0, 8)}`,
      }
    } else if (userRole === USER_ROLES.CLINIC) {
      return {
        icon: User,
        label: "Пациент",
        value: `#${appointment.patientId.slice(0, 8)}`,
        secondary: appointment.doctorId
          ? {
              icon: Stethoscope,
              label: "Врач",
              value: `#${appointment.doctorId.slice(0, 8)}`,
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
          variant="ghost"
          size={isMobile ? "sm" : "iconMd"}
          onClick={() => onCancel(appointment.id)}
          className={cn(isMobile && "w-full")}
        >
          <X className="h-4 w-4" />
          {isMobile && "Отменить"}
        </Button>
      )}
    </>
  )

  return (
    <Card>
      <CardContent className={cn("flex items-start gap-4", isMobile && "flex-col")}>
        <div className="w-full min-w-0 flex-1">
          {headerInfo && (
            <CardTitle className="mb-2 flex items-center gap-2">
              <headerInfo.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">
                {headerInfo.label} {headerInfo.value}
              </span>
            </CardTitle>
          )}
          {headerInfo?.secondary && (
            <div className="text-muted-foreground mb-2 flex items-center gap-2">
              <headerInfo.secondary.icon className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm">
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
              {format(appointmentDate, "HH:mm")} ({appointment.duration} мин.)
            </div>
            <Badge variant="outline">
              {APPOINTMENT_TYPE_LABELS[appointment.type as keyof typeof APPOINTMENT_TYPE_LABELS]}
            </Badge>
            <Badge
              variant={
                appointment.status === "confirmed"
                  ? "default"
                  : appointment.status === "cancelled"
                    ? "destructive"
                    : "secondary"
              }
            >
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
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
            "flex-col",
            isMobile && (canConfirm || canComplete || canCancel) && "border-t",
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
