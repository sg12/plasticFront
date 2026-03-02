import type { AUTH_TYPE } from "@/entities/auth/types/auth.types"
import type { TICKET_STATUS } from "../model/support.constants"

export interface Ticket {
  id: string
  userId: string
  moderationId: string | null
  title: string
  status: TICKET_STATUS
  messages: TicketMessages[]
  createdAt: string
  updatedAt: string
}

export interface TicketMessages {
  id: string
  ticketId: string
  senderId: string
  type: AUTH_TYPE
  text: string
  createdAt: string
}

export type TICKET_STATUS = keyof typeof TICKET_STATUS
