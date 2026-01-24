/**
 * @fileoverview Виджет для управления записями пациента
 *
 * @module widgets/patientAppointments/ui/PatientAppointments
 */

import { useUserStore } from "@/entities/user/model/store"
import { AppointmentsList } from "@/features/appointments/ui/AppointmentsList"
import { USER_ROLES } from "@/entities/user/model/constants"
import { usePatientAppointments } from "@/features/appointments/hooks/usePatientAppointments"

export const PatientAppointments = () => {
  const { profile } = useUserStore()
  const { handleCancel } = usePatientAppointments()

  if (!profile?.id) {
    return null
  }

  return (
    <AppointmentsList
      userRole={USER_ROLES.PATIENT}
      userId={profile.id}
      title="Мои записи"
      description="Управляйте своими записями на приём"
      showDateGrouping={true}
      limit={10}
      onCancel={handleCancel}
    />
  )
}
