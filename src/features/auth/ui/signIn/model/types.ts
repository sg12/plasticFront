import type z from "zod"

import { basicInfoSchema } from "@/entities/user/model/user.schema"

export const signInSchema = basicInfoSchema.pick({
  email: true,
  password: true,
})

export type SignInFormData = z.infer<typeof signInSchema>
