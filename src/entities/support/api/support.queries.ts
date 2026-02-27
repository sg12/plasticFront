import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as supportApi from "./support.api"
import type { CreateTicketDto, ReplyTicketDto } from "../model/support.schema"

export const supportKeys = {
  all: ["tickets"] as const,
  lists: () => [...supportKeys.all, "list"] as const,
  detail: (id: string) => [...supportKeys.all, "detail", id] as const,
}

export const useTickets = () => {
  return useQuery({
    queryKey: supportKeys.lists(),
    queryFn: supportApi.getTickets,
  })
}

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: supportKeys.detail(id),
    queryFn: () => supportApi.getTicket(id),
    enabled: !!id,
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateTicketDto) => supportApi.createTicket(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.lists() })
    },
  })
}

export const useReplyTicket = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: ReplyTicketDto) => supportApi.replyTicket(id, dto),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(supportKeys.detail(id), updatedTicket)
      queryClient.invalidateQueries({ queryKey: supportKeys.lists() })
    },
  })
}

export const useCloseTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => supportApi.closeTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: supportKeys.lists() })
    },
  })
}
