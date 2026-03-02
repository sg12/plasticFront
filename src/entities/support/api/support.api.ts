import { api } from "@/shared/api/axiosInstance"
import type { Ticket } from "../types/support.types"
import type { CreateTicketDto, ReplyTicketDto } from "../model/support.schema"

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await api.get<Ticket[]>("support/tickets")
  return data
}

export const getTicket = async (id: string): Promise<Ticket> => {
  const { data } = await api.get<Ticket>(`support/tickets/${id}`)
  return data
}

export const createTicket = async (createTicketDto: CreateTicketDto): Promise<Ticket> => {
  const { data } = await api.post<Ticket>("support/tickets", createTicketDto)
  return data
}

export const replyTicket = async (id: string, replyTicketDto: ReplyTicketDto): Promise<Ticket> => {
  const { data } = await api.post<Ticket>(`support/tickets/${id}/reply`, replyTicketDto)
  return data
}

export const closeTicket = async (id: string): Promise<void> => {
  return await api.post(`support/tickets/${id}/close`)
}
