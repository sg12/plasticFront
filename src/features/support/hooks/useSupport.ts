import { useState, useMemo } from "react"
import type { FileRecord } from "@/features/fileUpload/types/types"
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
} from "@/entities/support/types/types"
import { logger } from "@/shared/lib/logger"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createSupportTicketSchema } from "@/entities/support/model/schema"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"

export const useSupport = (ticketId?: string | null) => {
  const { user } = useAuthStore()
  const { mutate: globalMutate } = useSWRConfig()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({})
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Получение списка тикетов
  const {
    data: tickets,
    error: ticketsError,
    isValidating: isLoadingTickets,
    mutate: refreshTickets,
  } = useSWR<SupportTicket[]>(user?.id ? ["supportTickets", user.id] : null, () => {
    if (!user?.id) {
      throw new Error("Пользователь не авторизован")
    }
    return getUserTickets(user.id)
  })

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
    console.log(uploadedFiles)

    // Преобразуем UploadedFilesByRole в File[]
    const filesArray: File[] = []
    Object.values(uploadedFiles).forEach((roleFiles) => {
      if (roleFiles) {
        Object.values(roleFiles).forEach((fileOrArray) => {
          if (Array.isArray(fileOrArray)) {
            filesArray.push(...fileOrArray)
          } else {
            filesArray.push(fileOrArray)
          }
        })
      }
    })

    try {
      await createTicket({
        subject: data.subject,
        message: data.message,
        attachments: filesArray.length > 0 ? filesArray : undefined,
      })

      form.reset()
      setUploadedFiles({})
    } catch (error) {
      // Ошибка уже обработана в createTicket
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string | number | symbol,
  ) => {
    const files = e.target.files
    if (!files?.length) {
      return
    }

    const key = String(fileType)
    // Для поддержки используем PATIENT как дефолтную роль
    const defaultRole = USER_ROLES.PATIENT as keyof UploadedFilesByRole

    setUploadedFiles((prev) => {
      return {
        ...prev,
        [defaultRole]: {
          ...(prev[defaultRole] ?? {}),
          [key]: files.length > 1 ? Array.from(files) : files[0],
        },
      }
    })
  }

  // Преобразуем UploadedFilesByRole в FileRecord для FileUpload компонента
  const uploadedFilesForForm: FileRecord = useMemo(() => {
    const result: FileRecord = {}
    Object.values(uploadedFiles).forEach((roleFiles) => {
      if (roleFiles) {
        Object.entries(roleFiles).forEach(([key, value]) => {
          result[key] = value
        })
      }
    })
    return result
  }, [uploadedFiles])

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
    uploadedFiles: uploadedFilesForForm,
    setUploadedFiles,

    // Удаление тикета
    deleteTicket,
    isDeleting,
  }
}
