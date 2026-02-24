import type { APPOINTMENT_STATUS, APPOINTMENT_TYPE } from "../model/appointment.constants"

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  clinicId: string | null
  timeSlotId: string
  status: APPOINTMENT_STATUS
  type: APPOINTMENT_TYPE
  reason: string | null
  notes: string | null
  serviceIds: string[]
  createdAt: string
  updatedAt: string
}

export type APPOINTMENT_STATUS = keyof typeof APPOINTMENT_STATUS
export type APPOINTMENT_TYPE = keyof typeof APPOINTMENT_TYPE
