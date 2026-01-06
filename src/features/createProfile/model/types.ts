import { z } from "zod"
import type { createProfileSchema } from "./schema"

export type CreateProfileFormData = z.infer<typeof createProfileSchema>