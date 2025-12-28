import { useState } from "react"
import useSWR from "swr"
import { useSWRConfig } from "swr"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { fetchUserTickets, createSupportTicket, fetchTicketReplies } from "../api/api"
import type { SupportTicket, SupportTicketReply, CreateSupportTicketData } from "../model/types"

export const useSupportTickets = () => {
  const { user } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR<SupportTicket[]>(
    user?.id ? ["supportTickets", user.id] : null,
    () => {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }
      return fetchUserTickets(user.id)
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30 * 1000,
      dedupingInterval: 1 * 60 * 1000,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
      shouldRetryOnError: (error) => {
        const errorMessage = error?.message?.toLowerCase() || ""
        return errorMessage.includes("network") || errorMessage.includes("timeout")
      },
      onError: (error) => {
        console.error("Error loading support tickets:", error)
      },
    },
  )

  return {
    tickets: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  }
}

export const useTicketReplies = (ticketId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<SupportTicketReply[]>(
    ticketId ? ["supportTicketReplies", ticketId] : null,
    () => {
      if (!ticketId) {
        throw new Error("Ticket ID is required")
      }
      return fetchTicketReplies(ticketId)
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30 * 1000,
      dedupingInterval: 1 * 60 * 1000,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
      shouldRetryOnError: (error) => {
        const errorMessage = error?.message?.toLowerCase() || ""
        return errorMessage.includes("network") || errorMessage.includes("timeout")
      },
      onError: (error) => {
        console.error(`Error loading replies for ticket ${ticketId}:`, error)
      },
    },
  )

  return {
    replies: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  }
}

export const useCreateSupportTicket = () => {
  const { user } = useAuthStore()
  const { mutate: globalMutate } = useSWRConfig()
  const [isCreating, setIsCreating] = useState(false)

  const createTicket = async (data: CreateSupportTicketData) => {
    if (!user?.id) {
      toast.error("Вы не авторизованы")
      throw new Error("User not authenticated")
    }

    setIsCreating(true)
    try {
      const newTicket = await createSupportTicket(user.id, data)

      // Инвалидируем кеш обращений
      await globalMutate(["supportTickets", user.id])

      toast.success("Обращение успешно отправлено")
      return newTicket
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при отправке обращения"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createTicket,
    isCreating,
  }
}
