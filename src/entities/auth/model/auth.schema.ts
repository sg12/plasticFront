import { z } from "zod"
import { AUTH_TYPE } from "./auth.constants"

export const AuthShape = z.object({
  id: z.uuid(),
  type: z.enum(AUTH_TYPE),
  email: z.email(),
  phone: z.string(),
  confirmed: z.boolean(),
  emailConfirmedAt: z.iso.datetime().nullable(),
  recoverySentAt: z.iso.datetime().nullable(),
  lastSignInAt: z.iso.datetime().nullable(),
  lastChangePasswordAt: z.iso.datetime().nullable(),
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  // .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
  // .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
})

export type LoginDto = z.infer<typeof LoginSchema>
