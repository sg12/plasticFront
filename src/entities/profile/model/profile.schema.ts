import {
  ClinicProfileSchema,
  DoctorProfileSchema,
  PatientProfileSchema,
} from "@/entities/user/model/user.schema"
import { z } from "zod"

export const CreateProfileSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("PATIENT"),
    patient: PatientProfileSchema.partial(),
  }),
  z.object({
    role: z.literal("DOCTOR"),
    doctor: DoctorProfileSchema.partial(),
  }),
  z.object({
    role: z.literal("CLINIC"),
    clinic: ClinicProfileSchema.partial(),
  }),
])

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>
