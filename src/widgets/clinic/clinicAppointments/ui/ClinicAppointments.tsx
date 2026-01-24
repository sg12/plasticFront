/**
 * @fileoverview Виджет для управления записями клиники
 *
 * @module widgets/clinicAppointments/ui/ClinicAppointments
 */

import { useUserStore } from "@/entities/user/model/store"
import { AppointmentsList } from "@/features/appointments/ui/AppointmentsList"
import { USER_ROLES } from "@/entities/user/model/constants"
import { useClinicAppointments } from "@/features/appointments/hooks/useClinicAppointments"

export const ClinicAppointments = () => {
  const { profile } = useUserStore()
  const { handleComplete } = useClinicAppointments()

  if (!profile?.id) {
    return null
  }

  return (
    <AppointmentsList
      userRole={USER_ROLES.CLINIC}
      userId={profile.id}
      title="Записи клиники"
      description="Управляйте записями всех врачей клиники"
      showDoctorFilter={true}
      limit={100}
      onComplete={handleComplete}
    />
  )
}
