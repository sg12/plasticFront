import z from "zod"
import { ZONES_CONST } from "./ai-visualization.constants"

export const VisualizeAiSchema = z.object({
  zone: z.enum(Object.keys(ZONES_CONST) as [string, ...string[]]),
  description: z
    .string()
    .min(1, "Описание не может быть пустым")
    .max(1000, "Описание слишком длинное (макс. 1000 символов)"),
})

export type VisualizeAiDto = z.infer<typeof VisualizeAiSchema>
