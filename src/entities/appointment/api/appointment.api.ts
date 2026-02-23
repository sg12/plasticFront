export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  clinicId?: string
  timeSlotId: string
  status: APPOINTMENT_STATUS
  type: APPOINTMENT_TYPE
  reason?: string
  notes?: string
  serviceIds: string[]
}
