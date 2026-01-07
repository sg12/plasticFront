import type { signUpSchema } from "../model/schema"
import type z from "zod"

export type SignUpFormData = z.infer<typeof signUpSchema>
