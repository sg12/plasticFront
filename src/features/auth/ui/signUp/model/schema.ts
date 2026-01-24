import { USER_ROLES } from "@/entities/user/model/constants"
import {
  basicInfoSchema,
  clinicInfoSchema,
  doctorInfoSchema,
  patientInfoSchema,
} from "@/entities/user/model/schema"
import z from "zod"

export const signUpSchema = z
  .object({
    role: z.enum(USER_ROLES),
    basic: basicInfoSchema,
    patient: patientInfoSchema.optional(),
    doctor: doctorInfoSchema.optional(),
    clinic: clinicInfoSchema.optional(),
  })
  .refine((data) => data.basic.password === data.basic.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["basic", "confirmPassword"],
  })
