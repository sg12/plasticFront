import { z } from "zod"
import { APPOINTMENT_STATUS, APPOINTMENT_TYPE } from "../model/appointment.constants"

const AppointmentStatusSchema = z.enum(APPOINTMENT_STATUS)
const AppointmentTypeSchema = z.enum(APPOINTMENT_TYPE)

export const AppointmentSchema = z.object({
  id: z.uuid(),
  patientId: z.uuid(),
  doctorId: z.uuid(),
  clinicId: z.uuid().nullable(),
  timeSlotId: z.uuid(),
  status: AppointmentStatusSchema,
  type: AppointmentTypeSchema,
  reason: z.string().nullable(),
  notes: z.string().nullable(),
  serviceIds: z.array(z.uuid()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const CreateAppointmentSchema = z.object({
  doctorId: z.uuid(),
  timeSlotId: z.uuid({ error: "Пожалуйста, выберите временной слот" }),
  reason: z.string().max(500).optional(),
})

export type AppointmentDto = z.infer<typeof AppointmentSchema>
export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>
