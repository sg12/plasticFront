import { z } from "zod"

export const TicketSchema = z.object({
  id: z.uuid(),
  ticketId: z.uuid(),
  senderId: z.uuid(),
  text: z.string().min(1),
  createdAt: z.iso.datetime(),
})

export const CreateTicketSchema = z.object({
  title: z
    .string()
    .min(1, "Заголовок не может быть пустым")
    .min(5, "Заголовок должен быть не короче 5 символов")
    .max(255, "Заголовок слишком длинный (макс. 255 символов)"),

  text: z
    .string()
    .min(1, "Сообщение не может быть пустым")
    .min(10, "Опишите проблему подробнее (минимум 10 символов)"),
})

export const ReplyTicketSchema = z.object({
  text: z
    .string()
    .min(1, "Сообщение не может быть пустым")
    .min(10, "Ответ должен быть более информативным (минимум 10 символов)"),
})

export type CreateTicketDto = z.infer<typeof CreateTicketSchema>
export type ReplyTicketDto = z.infer<typeof ReplyTicketSchema>
