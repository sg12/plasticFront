/**
 * @fileoverview Виджет для управления записями врача
 *
 * @module widgets/doctorAppointments/ui/DoctorAppointments
 */

import { useUserStore } from "@/entities/user/model/user.store"
import { AppointmentsList } from "@/features/appointments/ui/AppointmentsList"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import { DoctorScheduleButton } from "@/features/doctor/ui/DoctorScheduleButton"
import { useDoctorAppointments } from "@/features/appointments/hooks/useDoctorAppointments"

export const DoctorAppointments = () => {
  const { profile } = useUserStore()
  const { handleConfirm, handleCancel, handleComplete } = useDoctorAppointments()

  if (!profile?.id) {
    return null
  }

  return (
    <AppointmentsList
      userRole={USER_ROLES.DOCTOR}
      userId={profile.id}
      title="Записи на приём"
      description="Управляйте записями пациентов"
      headerActions={<DoctorScheduleButton />}
      showDateGrouping={true}
      limit={10}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onComplete={handleComplete}
    />
  )
}
