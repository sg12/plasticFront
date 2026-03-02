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

import { useMemo, useState } from "react"
import { Skeleton } from "@/shared/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Calendar } from "lucide-react"
import { AppointmentCard } from "@/widgets/appointments/AppointmentCard"
import { EmptyState } from "@/shared/ui/emptyState"
import { ErrorState } from "@/shared/ui/errorState"
import { useIsMobile } from "@/shared/hooks/useMobile"
import type { Appointment } from "@/entities/appointment/types/appointment.types"
import type { ROLE } from "@/entities/user/types/user.types"
import { AppointmentStatusFilter } from "@/features/user-management/appointments/ui/AppointmentStatusFilter"
import { useAppointments } from "@/entities/appointment/api/appointment.queries"
import { isBefore, parseISO } from "date-fns"
import { APPOINTMENT_STATUS } from "@/entities/appointment/model/appointment.constants"

interface AppointmentsListProps {
  userRole: ROLE
  userId: string
  showDoctorFilter?: boolean
  showDateGrouping?: boolean
  limit?: number
  onConfirm?: (appointmentId: string) => Promise<Appointment>
  onCancel?: (appointmentId: string) => Promise<Appointment>
  onComplete?: (appointmentId: string) => Promise<Appointment>
}

export const AppointmentsList = ({
  userRole,
  showDoctorFilter = false,
  showDateGrouping = false,
  limit = 10,
  onConfirm,
  onCancel,
  onComplete,
}: AppointmentsListProps) => {
  const { data: appointments = [], error, refetch, isLoading } = useAppointments()

  const [selectedStatus, setSelectedStatus] = useState<keyof typeof APPOINTMENT_STATUS>(APPOINTMENT_STATUS.ALL)
  const [selectedDoctor, setSelectedDoctor] = useState<string>(APPOINTMENT_STATUS.ALL)

  const isMobile = useIsMobile()

  const filteredAppointments = useMemo(() => {
    let result = [...appointments]

    if (selectedStatus !== APPOINTMENT_STATUS.ALL) {
      result = result.filter((a) => a.status === selectedStatus)
    }

    if (showDoctorFilter && selectedDoctor !== APPOINTMENT_STATUS.ALL) {
      result = result.filter((a) => a.doctorId === selectedDoctor)
    }

    result.sort((a, b) => parseISO(b.timeSlot.startAt).getTime() - parseISO(a.timeSlot.startAt).getTime())

    return limit ? result.slice(0, limit) : result
  }, [appointments, selectedStatus, selectedDoctor, showDoctorFilter, limit])

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!showDateGrouping) return { upcomingAppointments: filteredAppointments, pastAppointments: [] }

    const now = new Date()
    return filteredAppointments.reduce(
      (acc, app) => {
        const appDate = parseISO(app.timeSlot.startAt)
        if (isBefore(appDate, now) && app.status !== APPOINTMENT_STATUS.CONFIRMED) {
          acc.pastAppointments.push(app)
        } else {
          acc.upcomingAppointments.push(app)
        }
        return acc
      },
      { upcomingAppointments: [] as Appointment[], pastAppointments: [] as Appointment[] }
    )
  }, [filteredAppointments, showDateGrouping])

  if (error) {
    return <ErrorState error={error} title="Ошибка загрузки записей" onRetry={refetch} />
  }

  if (appointments.length === 0 && !isLoading) {
    return <EmptyState icon={Calendar} title="У вас пока нет записей" />
  }

  const appointmentsToShow = showDateGrouping ? upcomingAppointments : appointments
  const hasPastAppointments = showDateGrouping && pastAppointments.length > 0

  return (
    <div className="space-global">
      <div className={`mb-6 flex flex-wrap gap-4 ${showDoctorFilter ? "" : "gap-2"}`}>
        <AppointmentStatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        {showDoctorFilter && appointments.length > 0 && (
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className={isMobile ? "w-full" : "w-[200px]"}>
              <SelectValue placeholder="Все врачи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={APPOINTMENT_STATUS.ALL}>Все врачи</SelectItem>
              {appointments.map((appointment) => (
                <SelectItem key={appointment.doctorId} value={appointment.doctorId}>
                  Врач {appointment.doctor.user.fullName || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
        }
      </div >

      {
        isLoading ? (
          <div className="space-y-4" >
            {
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))
            }
          </div>
        ) : (
          <>
            {appointmentsToShow.length > 0 && (
              <div className={showDateGrouping ? "mb-8" : ""}>
                {showDateGrouping && (
                  <h2 className="mb-4 text-xl font-semibold">Предстоящие записи</h2>
                )}
                <div className={showDateGrouping ? "space-child" : "space-y-4"}>
                  {appointmentsToShow.map((appointment: Appointment) => (
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
                  {pastAppointments.map((appointment: Appointment) => (
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
          </>
        )}
    </div >
  )
}
