import { supabase } from "@/shared/api/supabase/client"
import type { SupportTicket, CreateSupportTicketData, SupportTicketReply } from "../types/types"
import { logger } from "@/shared/lib/logger"
import type { User } from "@supabase/supabase-js"
import { createSupportTicketCreatedNotification } from "@/entities/notification/utils/helpers"

const TABLE_NAME = "supportTickets" // TABLE
const REPLIES_TABLE_NAME = "supportTicketReplies" // TABLE
const STORAGE_BUCKET = "support_attachments" // BUCKET
const SEND_SUPPORT_TO_TELEGRAM = "send_support_to_telegram" // EDGE

export const getUserTickets = async (userId: User["id"]): Promise<SupportTicket[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })

  if (error) throw error
  return data || []
}

export const createSupportTicket = async (
  userId: string,
  ticketData: CreateSupportTicketData,
): Promise<SupportTicket> => {
  logger.info("Создание обращения в поддержку", {
    userId,
    subject: ticketData.subject,
    hasAttachments: !!ticketData.attachments?.length,
  })

  let attachmentUrls: string[] = []

  if (ticketData.attachments && ticketData.attachments.length > 0) {
    try {
      const filesArray = Array.isArray(ticketData.attachments)
        ? ticketData.attachments
        : [ticketData.attachments]

      for (const file of filesArray) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${userId}/tickets/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          logger.error("Ошибка загрузки файла вложения", new Error(uploadError.message), {
            userId,
            fileName: file.name,
          })
          continue
        }

        attachmentUrls.push(filePath)
      }
    } catch (error) {
      logger.error("Ошибка при загрузке файлов вложений", error as Error, {
        userId,
        fileCount: ticketData.attachments?.length || 0,
      })
    }
  }

  // Создаем обращение в БД
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      userId: userId,
      subject: ticketData.subject,
      message: ticketData.message,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
      status: "open",
      priority: "medium",
    })
    .select()
    .single()

  if (error) {
    // Более понятное сообщение об ошибке RLS
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    throw error
  }

  if (!data) {
    logger.error("Не удалось создать обращение", new Error("No data returned"), {
      userId,
    })
    throw new Error("Не удалось создать обращение")
  }

  logger.info("Обращение успешно создано", {
    userId,
    ticketId: data.id,
  })

  // Создаём уведомление пользователю
  createSupportTicketCreatedNotification(userId, data.id).catch((error) => {
    logger.error("Ошибка создания уведомления о создании обращения", error as Error, {
      userId,
      ticketId: data.id,
    })
  })

  sendToTelegram(data, userId).catch((error) => {
    logger.error("Не удалось отправить обращение в Telegram", error as Error, {
      userId,
      ticketId: data.id,
    })
  })

  return data
}

async function sendToTelegram(ticket: SupportTicket, userId: string): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, fullName, role")
    .eq("id", userId)
    .single()

  const user = profile
    ? {
        id: userId,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
      }
    : { id: userId }

  const { error } = await supabase.functions.invoke(SEND_SUPPORT_TO_TELEGRAM, {
    body: {
      ticket,
      user,
    },
  })

  if (error) {
    throw error
  }
}

export const getTicketReplies = async (ticketId: string): Promise<SupportTicketReply[]> => {
  const { data, error } = await supabase
    .from(REPLIES_TABLE_NAME)
    .select("*")
    .eq("ticketId", ticketId)
    .order("createdAt", { ascending: true })

  if (error) throw error
  return data || []
}

export const deleteSupportTicket = async (ticketId: string, userId: string): Promise<void> => {
  logger.info("Удаление обращения в поддержку", {
    userId,
    ticketId,
  })

  // Сначала получаем тикет, чтобы удалить файлы из storage
  const { data: ticket, error: fetchError } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", ticketId)
    .eq("userId", userId)
    .single()

  if (fetchError) {
    logger.error("Ошибка получения тикета для удаления", new Error(fetchError.message), {
      userId,
      ticketId,
    })
    throw fetchError
  }

  if (!ticket) {
    throw new Error("Обращение не найдено")
  }

  // Удаляем файлы из storage, если они есть
  if (ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0) {
    try {
      const filesToDelete = ticket.attachments.map((filePath: string) => filePath)
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(filesToDelete)

      if (deleteError) {
        logger.error("Ошибка удаления файлов из storage", new Error(deleteError.message), {
          userId,
          ticketId,
          files: filesToDelete,
        })
      }
    } catch (error) {
      logger.error("Ошибка при удалении файлов", error as Error, {
        userId,
        ticketId,
      })
    }
  }

  // Удаляем ответы на тикет
  const { error: deleteRepliesError } = await supabase
    .from(REPLIES_TABLE_NAME)
    .delete()
    .eq("ticketId", ticketId)

  if (deleteRepliesError) {
    logger.error("Ошибка удаления ответов", new Error(deleteRepliesError.message), {
      userId,
      ticketId,
    })
    // Не прерываем выполнение, продолжаем удаление тикета
  }

  // Удаляем сам тикет
  const { error: deleteError } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", ticketId)
    .eq("userId", userId)

  if (deleteError) {
    logger.error("Ошибка удаления обращения", new Error(deleteError.message), {
      userId,
      ticketId,
    })
    throw deleteError
  }

  logger.info("Обращение успешно удалено", {
    userId,
    ticketId,
  })
}
