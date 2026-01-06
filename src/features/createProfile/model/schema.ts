import { USER_ROLES } from "@/entities/user/model/constants"
import {
  clinicInfoSchema,
  doctorInfoSchema,
  patientInfoSchema,
} from "@/entities/user/model/schema"
import z from "zod"

export const createProfileSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(USER_ROLES.PATIENT),
    patient: patientInfoSchema.optional(),
  }),
  z.object({
    role: z.literal(USER_ROLES.DOCTOR),
    doctor: doctorInfoSchema,
  }),
  z.object({
    role: z.literal(USER_ROLES.CLINIC),
    clinic: clinicInfoSchema,
  }),
])