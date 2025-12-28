import { z } from "zod"

export const createSupportTicketSchema = z.object({
  subject: z
    .string()
    .min(3, "Тема должна содержать минимум 3 символа")
    .max(200, "Тема слишком длинная"),
  message: z
    .string()
    .min(10, "Сообщение должно содержать минимум 10 символов")
    .max(5000, "Сообщение слишком длинное"),
  attachments: z.array(z.instanceof(File)).optional(),
})

export type CreateSupportTicketFormData = z.infer<typeof createSupportTicketSchema>
