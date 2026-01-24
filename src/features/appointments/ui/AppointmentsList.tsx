/**
 * @fileoverview Универсальный компонент для отображения списка записей на приём
 *
 * Объединяет логику отображения записей для всех ролей пользователей:
 * - Пациент: показывает свои записи с возможностью отмены
 * - Врач: показывает записи пациентов с возможностью подтверждения, отмены и завершения
 * - Клиника: показывает записи всех врачей клиники с возможностью завершения
 *
 * @module features/appointments/ui/AppointmentsList
 */

import { useEffect, useMemo, useState } from "react"
import { useAppointmentsStore } from "@/entities/appointments/model/store"
import { Card } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Calendar } from "lucide-react"
import { APPOINTMENT_STATUS_LABELS } from "@/entities/appointments/model/constants"
import type { AppointmentStatus } from "@/entities/appointments/types/types"
import { AppointmentCard } from "@/widgets/appointmentCard/ui/AppointmentCard"
import type { UserRole } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { EmptyState } from "@/shared/ui/emptyState"
import { ErrorState } from "@/shared/ui/errorState"

interface AppointmentsListProps {
  /** Роль пользователя */
  userRole: UserRole
  /** ID пользователя для фильтрации */
  userId: string
  /** Заголовок страницы */
  title: string
  /** Описание страницы */
  description: string
  /** Дополнительные элементы в заголовке (например, кнопка расписания) */
  headerActions?: React.ReactNode
  /** Показывать ли фильтр по врачам (только для клиники) */
  showDoctorFilter?: boolean
  /** Показывать ли группировку по датам (предстоящие/прошлые) */
  showDateGrouping?: boolean
  /** Лимит записей на странице */
  limit?: number
  /** Обработчик подтверждения записи */
  onConfirm?: (appointmentId: string) => Promise<void>
  /** Обработчик отмены записи */
  onCancel?: (appointmentId: string) => Promise<void>
  /** Обработчик завершения записи */
  onComplete?: (appointmentId: string) => Promise<void>
}

export const AppointmentsList = ({
  userRole,
  userId,
  title,
  description,
  headerActions,
  showDoctorFilter = false,
  showDateGrouping = false,
  limit = 10,
  onConfirm,
  onCancel,
  onComplete,
}: AppointmentsListProps) => {
  const { appointments, isLoading, error, loadAppointments, clearError } = useAppointmentsStore()
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | "all">("all")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")

  const getFilters = useMemo(() => {
    const baseFilters: {
      patientId?: string
      doctorId?: string
      clinicId?: string
      status?: AppointmentStatus | AppointmentStatus[]
    } = {}

    if (userRole === USER_ROLES.PATIENT) {
      baseFilters.patientId = userId
    } else if (userRole === USER_ROLES.DOCTOR) {
      baseFilters.doctorId = userId
    } else if (userRole === USER_ROLES.CLINIC) {
      baseFilters.clinicId = userId
    }

    if (selectedStatus !== "all") {
      baseFilters.status = selectedStatus
    }

    if (showDoctorFilter && selectedDoctor !== "all") {
      baseFilters.doctorId = selectedDoctor
    }

    return baseFilters
  }, [userRole, userId, selectedStatus, selectedDoctor, showDoctorFilter])

  useEffect(() => {
    if (userId) {
      loadAppointments(getFilters, { page: 1, limit })
    }
  }, [userId, getFilters, limit, loadAppointments])

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(appointments.map((apt) => apt.doctorId).filter((id): id is string => id !== null)),
      ),
    [appointments],
  )

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!showDateGrouping) {
      return { upcomingAppointments: appointments, pastAppointments: [] }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const now = new Date()

    if (userRole === USER_ROLES.DOCTOR) {
      // Для врача: предстоящие = будущие + записи, которые можно завершить
      const upcoming = appointments.filter((apt) => {
        const aptDate = new Date(apt.dateTime)
        const isFuture = aptDate > tomorrow
        const isPastOrToday = aptDate <= now
        const canBeCompleted = isPastOrToday && apt.status === "confirmed"
        return (
          (isFuture || canBeCompleted) && apt.status !== "cancelled" && apt.status !== "completed"
        )
      })

      const past = appointments.filter((apt) => {
        const aptDate = new Date(apt.dateTime)
        const isPast = aptDate <= tomorrow
        const isCompleted = apt.status === "completed"
        const isCancelled = apt.status === "cancelled"
        const canBeCompleted = aptDate <= now && apt.status === "confirmed"
        return (isPast || isCompleted || isCancelled) && !canBeCompleted
      })

      return { upcomingAppointments: upcoming, pastAppointments: past }
    } else {
      // Для пациента: по дате
      const upcoming = appointments.filter(
        (apt) => new Date(apt.dateTime) > now && apt.status !== "cancelled",
      )
      const past = appointments.filter(
        (apt) => new Date(apt.dateTime) <= now || apt.status === "cancelled",
      )
      return { upcomingAppointments: upcoming, pastAppointments: past }
    }
  }, [appointments, showDateGrouping, userRole])

  const onRetry = () => {
    clearError()
    if (userId) {
      loadAppointments(getFilters, { page: 1, limit })
    }
  }

  if (error) {
    return (
      <Card>
        <ErrorState error={error} title="Ошибка загрузки записей" onRetry={onRetry} />
      </Card>
    )
  }

  const appointmentsToShow = showDateGrouping ? upcomingAppointments : appointments
  const hasPastAppointments = showDateGrouping && pastAppointments.length > 0

  return (
    <div className="space-global">
      <div
        className={`mb-6 ${headerActions ? "flex items-start justify-between max-lg:flex-col max-lg:gap-4" : ""}`}
      >
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      <div className={`mb-6 flex flex-wrap gap-4 ${showDoctorFilter ? "" : "gap-2"}`}>
        <div
          className={`flex gap-2 ${userRole === USER_ROLES.DOCTOR ? "grid md:grid-cols-2 lg:grid-cols-5" : ""}`}
        >
          {(["all", "pending", "confirmed", "cancelled", "completed"] as const).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status === "all" ? "Все" : APPOINTMENT_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
        {showDoctorFilter && doctors.length > 0 && (
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все врачи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все врачи</SelectItem>
              {doctors.map((doctorId) => (
                <SelectItem key={doctorId} value={doctorId}>
                  Врач #{doctorId.slice(0, 8)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          {appointmentsToShow.length > 0 && (
            <div className={showDateGrouping ? "mb-8" : ""}>
              {showDateGrouping && (
                <h2 className="mb-4 text-xl font-semibold">Предстоящие записи</h2>
              )}
              <div className={showDateGrouping ? "space-child" : "space-y-4"}>
                {appointmentsToShow.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole={userRole}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    onComplete={onComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {hasPastAppointments && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">История записей</h2>
              <div className="space-child">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole={userRole}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    onComplete={onComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && !isLoading && (
            <Card>
              <EmptyState icon={Calendar} title="У вас пока нет записей" />
            </Card>
          )}
        </>
      )}
    </div>
  )
}
