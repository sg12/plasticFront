/**
 * @fileoverview Виджет для управления записями 
 *
 */

import { usePatientAppointments } from "@/features/user-management/appointments/hooks/usePatientAppointments"
import { useMe } from "@/entities/user/api/user.queries"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { useClinicAppointments } from "@/features/user-management/appointments/hooks/useClinicAppointments"
import { DoctorScheduleButton } from "@/features/user-management/doctor/schedule/ui/DoctorScheduleButton"
import { useDoctorAppointments } from "@/features/user-management/appointments/hooks/useDoctorAppointments"
import { AppointmentsList } from "./AppointmentsList"

export const AppointmentForm = () => {
  const { data: user } = useMe()
  const { handleCancel: patientCancel } = usePatientAppointments()
  const { handleComplete: clinicComplete, handleCancel: clinicCancel, handleConfirm: clinicConfirm } = useClinicAppointments()
  const { handleComplete: doctorComplete, handleCancel: doctorCancel, handleConfirm: doctorConfirm, } = useDoctorAppointments()


  if (!user?.id) return null

  switch (user.role) {
    case USER_ROLE.PATIENT:
      return <AppointmentsList
        userRole={USER_ROLE.PATIENT}
        userId={user?.id}
        showDateGrouping={true}
        limit={10}
        onCancel={patientCancel} />
    case USER_ROLE.DOCTOR:
      return <AppointmentsList
        userRole={USER_ROLE.DOCTOR}
        userId={user.id}
        headerActions={<DoctorScheduleButton />}
        showDateGrouping={true}
        limit={10}
        onConfirm={doctorConfirm}
        onCancel={doctorCancel}
        onComplete={doctorComplete}
      />
    case USER_ROLE.CLINIC:
      return <AppointmentsList
        userRole={USER_ROLE.CLINIC}
        userId={user.id}
        showDoctorFilter={true}
        limit={100}
        onConfirm={clinicConfirm}
        onCancel={clinicCancel}
        onComplete={clinicComplete}
      />
    default:
      return (
        <div className="space-global">
          <p>Неизвестная роль пользователя</p>
        </div>
      )
  }
}

