import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { SupportTicket, SupportTicketReply, CreateSupportTicketData } from "./types"
import { fetchUserTickets, createSupportTicket, fetchTicketReplies } from "../api/api"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"

interface SupportState {
  tickets: SupportTicket[]
  ticketReplies: Record<string, SupportTicketReply[]>
  isLoading: boolean
  isLoadingReplies: Record<string, boolean>
  error: string | null
  repliesError: Record<string, string | null>

  loadTickets: () => Promise<void>
  loadTicketReplies: (ticketId: string) => Promise<void>
  createTicket: (data: CreateSupportTicketData) => Promise<void>
  refreshTickets: () => Promise<void>
  refreshReplies: (ticketId: string) => Promise<void>
  clearError: () => void
  clearRepliesError: (ticketId: string) => void
}

export const useSupportStore = create<SupportState>()(
  immer((set, get) => ({
    tickets: [],
    ticketReplies: {},
    isLoading: false,
    isLoadingReplies: {},
    error: null,
    repliesError: {},

    loadTickets: async () => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        set((state) => {
          state.error = "User not authenticated"
          state.isLoading = false
        })
        return
      }

      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const tickets = await fetchUserTickets(user.id)
        set((state) => {
          state.tickets = tickets
          state.isLoading = false
          state.error = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки обращений"
        set((state) => {
          state.error = errorMessage
          state.isLoading = false
        })
        console.error("Error loading tickets:", error)
      }
    },

    loadTicketReplies: async (ticketId: string) => {
      set((state) => {
        state.isLoadingReplies[ticketId] = true
        state.repliesError[ticketId] = null
      })

      try {
        const replies = await fetchTicketReplies(ticketId)
        set((state) => {
          state.ticketReplies[ticketId] = replies
          state.isLoadingReplies[ticketId] = false
          state.repliesError[ticketId] = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки ответов"
        set((state) => {
          state.isLoadingReplies[ticketId] = false
          state.repliesError[ticketId] = errorMessage
        })
        console.error(`Error loading replies for ticket ${ticketId}:`, error)
      }
    },

    createTicket: async (data: CreateSupportTicketData) => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        toast.error("Вы не авторизованы")
        return
      }

      try {
        const newTicket = await createSupportTicket(user.id, data)

        set((state) => {
          state.tickets.unshift(newTicket)
        })

        toast.success("Обращение успешно отправлено")
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при отправке обращения"
        toast.error(errorMessage)
        throw error
      }
    },

    refreshTickets: async () => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        return
      }

      try {
        const updatedTickets = await fetchUserTickets(user.id)
        set((state) => {
          state.tickets = updatedTickets
        })
      } catch (error) {
        console.error("Error refreshing tickets:", error)
      }
    },

    refreshReplies: async (ticketId: string) => {
      await get().loadTicketReplies(ticketId)
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    clearRepliesError: (ticketId: string) => {
      set((state) => {
        state.repliesError[ticketId] = null
      })
    },
  })),
)
