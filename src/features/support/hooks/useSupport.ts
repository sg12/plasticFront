import { useState } from "react"
import useSWR from "swr"
import { useSWRConfig } from "swr"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import {
  getUserTickets,
  createSupportTicket,
  getTicketReplies,
  deleteSupportTicket,
} from "@/entities/support/api/api"
import type {
  SupportTicket,
  SupportTicketReply,
  CreateSupportTicketData,
  CreateSupportTicketFormData,
  SupportFileRecord,
} from "@/entities/support/types/types"
import { logger } from "@/shared/lib/logger"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createSupportTicketSchema } from "@/entities/support/model/schema"

export const useSupport = (ticketId?: string | null) => {
  const { user } = useAuthStore()
  const { mutate: globalMutate } = useSWRConfig()
  const [attachedFiles, setAttachedFiles] = useState<SupportFileRecord>({})
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Получение списка тикетов
  const {
    data: tickets,
    error: ticketsError,
    isValidating: isLoadingTickets,
    mutate: refreshTickets,
  } = useSWR<SupportTicket[]>(
    user?.id ? ["supportTickets", user.id] : null,
    () => {
      if (!user?.id) {
        throw new Error("Пользователь не авторизован")
      }
      return getUserTickets(user.id)
    },
    {
      refreshInterval: 10000,
    },
  )

  // Получение ответов на тикет
  const {
    data: replies,
    error: repliesError,
    isValidating: isLoadingReplies,
    mutate: refreshReplies,
  } = useSWR<SupportTicketReply[]>(
    ticketId && user?.id ? ["supportTicketReplies", ticketId, user.id] : null,
    () => {
      if (!ticketId) {
        throw new Error("ID билета обязательно")
      }
      return getTicketReplies(ticketId)
    },
    {
      refreshInterval: 5000,
    },
  )

  // Форма для создания тикета
  const form = useForm<CreateSupportTicketFormData>({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: {
      subject: "",
      message: "",
      attachments: [],
    },
  })

  // Создание тикета
  const createTicket = async (data: CreateSupportTicketData) => {
    if (!user?.id) {
      toast.error("Вы не авторизованы")
      throw new Error("User not authenticated")
    }

    setIsCreating(true)
    try {
      logger.info("Создание обращения через хук", {
        userId: user.id,
        subject: data.subject,
      })
      const newTicket = await createSupportTicket(user.id, data)

      await globalMutate(["supportTickets", user.id])
      refreshTickets()

      logger.info("Обращение успешно создано через хук", {
        userId: user.id,
        ticketId: newTicket.id,
      })
      toast.success("Обращение успешно отправлено")
      return newTicket
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при отправке обращения"
      logger.error("Ошибка создания обращения через хук", error as Error, {
        userId: user.id,
      })
      toast.error(errorMessage)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  // Обработка отправки формы
  const onSubmit = async (data: CreateSupportTicketFormData) => {
    const files: File[] = []
    if (attachedFiles.attachments) {
      if (Array.isArray(attachedFiles.attachments)) {
        files.push(...attachedFiles.attachments)
      } else {
        files.push(attachedFiles.attachments)
      }
    }

    try {
      await createTicket({
        subject: data.subject,
        message: data.message,
        attachments: files.length > 0 ? files : undefined,
      })

      form.reset()
      setAttachedFiles({})
    } catch (error) {
      // Ошибка уже обработана в createTicket
    }
  }

  // Обработка изменения файлов
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof SupportFileRecord,
  ) => {
    const files = Array.from(e.target.files || [])

    // Проверка на максимальное количество файлов
    const existingFiles = attachedFiles.attachments
      ? Array.isArray(attachedFiles.attachments)
        ? attachedFiles.attachments
        : [attachedFiles.attachments]
      : []

    const totalFiles = existingFiles.length + files.length

    if (totalFiles > 5) {
      form.setError("attachments", {
        type: "manual",
        message: "Можно прикрепить максимум 5 файлов",
      })
      e.target.value = ""
      return
    }

    setAttachedFiles((prev) => ({
      ...prev,
      [fileType]: files.length > 1 ? files : files[0],
    }))
  }

  // Удаление тикета
  const deleteTicket = async (ticketId: string) => {
    if (!user?.id) {
      toast.error("Вы не авторизованы")
      throw new Error("User not authenticated")
    }

    setIsDeleting(true)
    try {
      logger.info("Удаление обращения через хук", {
        userId: user.id,
        ticketId,
      })

      await deleteSupportTicket(ticketId, user.id)

      // Обновляем список тикетов
      await globalMutate(["supportTickets", user.id])
      refreshTickets()

      logger.info("Обращение успешно удалено через хук", {
        userId: user.id,
        ticketId,
      })
      toast.success("Обращение успешно удалено")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при удалении обращения"
      logger.error("Ошибка удаления обращения через хук", error as Error, {
        userId: user.id,
        ticketId,
      })
      toast.error(errorMessage)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    // Тикеты
    tickets: tickets ?? [],
    isLoadingTickets,
    ticketsError: ticketsError?.message ?? null,
    refreshTickets,

    // Ответы на тикет
    replies: replies ?? [],
    isLoadingReplies,
    repliesError: repliesError?.message ?? null,
    refreshReplies,

    // Создание тикета
    form,
    FormProvider,
    onSubmit,
    handleFileChange,
    createTicket,
    isCreating,
    attachedFiles,
    setAttachedFiles,

    // Удаление тикета
    deleteTicket,
    isDeleting,
  }
}

// Обратная совместимость - экспортируем старые хуки как алиасы
export const useSupportTickets = () => {
  const { tickets, isLoadingTickets, ticketsError, refreshTickets } = useSupport()
  return {
    tickets,
    isLoading: isLoadingTickets,
    error: ticketsError,
    refresh: refreshTickets,
  }
}

export const useTicketReplies = (ticketId: string | null) => {
  const { replies, isLoadingReplies, repliesError, refreshReplies } = useSupport(ticketId)
  return {
    replies,
    isLoading: isLoadingReplies,
    error: repliesError,
    refresh: refreshReplies,
  }
}

export const useCreateSupportTicket = () => {
  const {
    form,
    FormProvider,
    onSubmit,
    handleFileChange,
    createTicket,
    isCreating,
    attachedFiles,
    setAttachedFiles,
  } = useSupport()
  return {
    form,
    FormProvider,
    onSubmit,
    handleFileChange,
    createTicket,
    isLoading: isCreating,
    attachedFiles,
    setAttachedFiles,
  }
}
