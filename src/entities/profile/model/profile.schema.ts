import {
  ClinicProfileSchema,
  DoctorProfileSchema,
  PatientProfileSchema,
} from "@/entities/user/model/user.schema"
import { z } from "zod"

export const CreateProfileSchema = z
  .union([
    z.object({
      patient: PatientProfileSchema,
      doctor: z.never().optional(),
      clinic: z.never().optional(),
    }),
    z.object({
      doctor: DoctorProfileSchema,
      patient: z.never().optional(),
      clinic: z.never().optional(),
    }),
    z.object({
      clinic: ClinicProfileSchema,
      patient: z.never().optional(),
      doctor: z.never().optional(),
    }),
  ])
  .refine(
    (data) => {
      const keys = Object.keys(data).filter((key) => data[key as keyof typeof data] !== undefined)
      return keys.length === 1
    },
    {
      message: "Необходимо заполнить данные только для одной роли: patient, doctor или clinic",
    },
  )

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>
