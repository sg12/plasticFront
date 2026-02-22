/**
 * @fileoverview Страница управления записями на приём
 *
 * Обёртка для разных ролей пользователей
 *
 * @module pages/appointments/ui/Appointments
 */

import { useUserStore } from "@/entities/user/model/user.store"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import { PatientAppointments } from "@/widgets/patient/patientAppointments/ui/PatientAppointments"
import { DoctorAppointments } from "@/widgets/doctor/doctorAppointments/ui/DoctorAppointments"
import { ClinicAppointments } from "@/widgets/clinic/clinicAppointments/ui/ClinicAppointments"

export const Appointments = () => {
  const { profile } = useUserStore()

  switch (profile?.role) {
    case USER_ROLES.PATIENT:
      return <PatientAppointments />
    case USER_ROLES.DOCTOR:
      return <DoctorAppointments />
    case USER_ROLES.CLINIC:
      return <ClinicAppointments />
    default:
      return (
        <div className="space-global">
          <p>Неизвестная роль пользователя</p>
        </div>
      )
  }
}
