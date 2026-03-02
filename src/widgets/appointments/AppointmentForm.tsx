/**
 * @fileoverview Виджет для управления записями 
 *
 */

import { useMe } from "@/entities/user/api/user.queries"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { AppointmentsList } from "./AppointmentsList"
import { useUpdateAppointmentStatus } from "@/entities/appointment/api/appointment.queries"
import { APPOINTMENT_STATUS } from "@/entities/appointment/model/appointment.constants"

export const AppointmentForm = () => {
  const { data: user } = useMe()

  const { mutateAsync: patientAppointment } = useUpdateAppointmentStatus()
  const { mutateAsync: doctorAppointment } = useUpdateAppointmentStatus()
  const { mutateAsync: clinicAppointment } = useUpdateAppointmentStatus()

  if (!user?.id) return null

  switch (user.role) {
    case USER_ROLE.PATIENT:
      return <AppointmentsList
        userRole={USER_ROLE.PATIENT}
        userId={user?.id}
        showDateGrouping={true}
        limit={10}
        onCancel={(appointmentId) => patientAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.CANCELED })} />
    case USER_ROLE.DOCTOR:
      return <AppointmentsList
        userRole={USER_ROLE.DOCTOR}
        userId={user.id}
        showDateGrouping={true}
        limit={10}
        onConfirm={(appointmentId) => doctorAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.CONFIRMED })}
        onCancel={(appointmentId) => doctorAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.CANCELED })}
        onComplete={(appointmentId) => doctorAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.COMPLETED })}
      />
    case USER_ROLE.CLINIC:
      return <AppointmentsList
        userRole={USER_ROLE.CLINIC}
        userId={user.id}
        showDoctorFilter={true}
        limit={100}
        onConfirm={(appointmentId) => clinicAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.CONFIRMED })}
        onCancel={(appointmentId) => clinicAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.CANCELED })}
        onComplete={(appointmentId) => clinicAppointment({ id: appointmentId, status: APPOINTMENT_STATUS.COMPLETED })}
      />
    default:
      return (
        <div className="space-global">
          <p>Неизвестная роль пользователя</p>
        </div>
      )
  }
}

