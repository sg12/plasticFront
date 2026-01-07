import { USER_ROLES } from "@/entities/user/model/constants";
import {
  basicInfoSchema,
  clinicInfoSchema,
  doctorInfoSchema,
  patientInfoSchema,
} from "@/entities/user/model/schema";
import z from "zod";

export const signUpSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(USER_ROLES.PATIENT),
    basic: basicInfoSchema,
    patient: patientInfoSchema.optional(),
  }),

  z.object({
    role: z.literal(USER_ROLES.DOCTOR),
    basic: basicInfoSchema,
    doctor: doctorInfoSchema,
  }),

  z.object({
    role: z.literal(USER_ROLES.CLINIC),
    basic: basicInfoSchema,
    clinic: clinicInfoSchema,
  }),
]);
