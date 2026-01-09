import type { createSupportTicketSchema } from "@/entities/support/model/schema"
import type { FileRecord } from '@/features/fileUpload/types/types'
import type z from "zod"

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "inProgress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  attachments?: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface CreateSupportTicketData {
  subject: string
  message: string
  attachments?: File[]
}

export interface ContactMethod {
  type: "email" | "phone" | "telegram" | "whatsapp"
  label: string
  value: string
  icon: string
}

export interface WorkingHours {
  days: readonly string[]
  hours: readonly string[]
}

export interface SupportTicketReply {
  id: string
  ticketId: string
  message: string
  isFromModerator: boolean
  createdAt: string
  createdBy?: string
}

export type SupportFileRecord = FileRecord & {
  attachments?: File | File[]
}

export type CreateSupportTicketFormData = z.infer<typeof createSupportTicketSchema>
