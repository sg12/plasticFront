import type { TimeSlot } from "@/entities/schedule/types/schedule.types"
import type { APPOINTMENT_STATUS, APPOINTMENT_TYPE } from "../model/appointment.constants"
import type { Clinic, Doctor, Patient } from "@/entities/user/types/user.types"

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
  timeSlot: TimeSlot
  doctor: Doctor
  clinic: Clinic
  patient: Patient
}

export type APPOINTMENT_STATUS = keyof typeof APPOINTMENT_STATUS
export type APPOINTMENT_TYPE = keyof typeof APPOINTMENT_TYPE
