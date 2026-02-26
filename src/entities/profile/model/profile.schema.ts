import {
  ClinicProfileSchema,
  DoctorProfileSchema,
  PatientProfileSchema,
} from "@/entities/user/model/user.schema"
import { z } from "zod"

export const CreateProfileSchema = z.union([
  z.object({
    patient: PatientProfileSchema.partial(),
  }),
  z.object({
    doctor: DoctorProfileSchema.partial(),
  }),
  z.object({
    clinic: ClinicProfileSchema.partial(),
  }),
])

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>
