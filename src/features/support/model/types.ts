export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  attachments?: string[]
  created_at: string
  updated_at: string
  resolved_at?: string
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
  ticket_id: string
  message: string
  is_from_moderator: boolean
  created_at: string
  created_by?: string
}
