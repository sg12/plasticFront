import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { CreateTicketSchema, type CreateTicketDto } from "@/entities/support/model/support.schema"
import {
  useTickets,
  useCreateTicket,
  useCloseTicket,
  useTicket,
} from "@/entities/support/api/support.queries" // Ваши новые хуки
import { useMe } from "@/entities/user/api/user.queries"
import { logger } from "@/shared/lib/logger"

export const useSupport = (ticketId?: string) => {
  const { data: user } = useMe()

  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    isFetching: isFetchingTickets,
    refetch: refreshTickets,
    error: errorTickets,
  } = useTickets()
  const { data: currentTicket, isLoading: isLoadingDetail } = useTicket(ticketId ?? "")

  const { mutateAsync: createMutation, isPending: createPending } = useCreateTicket()
  const { mutateAsync: closeMutation, isPending: closePending } = useCloseTicket()

  const form = useForm<CreateTicketDto>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  })

  const onSubmit = async (data: CreateTicketDto) => {
    if (!user) return toast.error("Вы не авторизованы")

    try {
      logger.info("Начало создания тикета", { title: data.title })

      await createMutation({
        ...data,
      })

      toast.success("Обращение успешно создано")
      form.reset()
    } catch (error) {
      logger.error("Ошибка при создании тикета", error as Error)
    }
  }

  const handleClose = async (id: string) => {
    try {
      await closeMutation(id)
      toast.success("Тикет закрыт")
    } catch (error) {
      logger.error("Ошибка при закрытии тикета", error as Error)
      toast.error("не удалось закрыть тикет")
    }
  }

  return {
    tickets,
    currentTicket,
    isLoading: isLoadingTickets || isLoadingDetail,
    isFetching: isFetchingTickets,
    error: errorTickets,

    form,
    FormProvider,
    onSubmit: form.handleSubmit(onSubmit),

    isCreating: createPending,
    isClosing: closePending,

    refreshTickets,
    closeTicket: handleClose,
  }
}
