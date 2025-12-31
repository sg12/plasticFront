import { supabase } from "@/shared/api/supabase/client"
import type { SupportTicket, CreateSupportTicketData, SupportTicketReply } from "../model/types"

const TABLE_NAME = "support_tickets"
const REPLIES_TABLE_NAME = "support_ticket_replies"
const STORAGE_BUCKET = "support_attachments"
const SEND_SUPPORT_TO_TELEGRAM = "send_support_to_telegram"

export const fetchUserTickets = async (userId: string): Promise<SupportTicket[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchTicket = async (ticketId: string): Promise<SupportTicket> => {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", ticketId).single()

  if (error) throw error
  if (!data) throw new Error("Ticket not found")

  return data
}

export const createSupportTicket = async (
  userId: string,
  ticketData: CreateSupportTicketData,
): Promise<SupportTicket> => {
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
          console.error("Ошибка загрузки файла:", uploadError)
          continue
        }

        attachmentUrls.push(filePath)
      }
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error)
    }
  }

  // Создаем обращение в БД
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
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
    throw new Error("Не удалось создать обращение")
  }

  sendToTelegram(data, userId).catch((error) => {
    console.error("Failed to send ticket to Telegram:", error)
  })

  return data
}

async function sendToTelegram(ticket: SupportTicket, userId: string): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .single()

  const user = profile
    ? {
        id: userId,
        email: profile.email,
        full_name: profile.full_name,
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

export const fetchTicketReplies = async (ticketId: string): Promise<SupportTicketReply[]> => {
  const { data, error } = await supabase
    .from(REPLIES_TABLE_NAME)
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchTicketWithReplies = async (
  ticketId: string,
): Promise<SupportTicket & { replies?: SupportTicketReply[] }> => {
  const ticket = await fetchTicket(ticketId)
  const replies = await fetchTicketReplies(ticketId)

  return {
    ...ticket,
    replies,
  }
}

export const getAttachmentUrl = async (filePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, 3600)

  if (error) throw error
  if (!data) throw new Error("Failed to create signed URL")

  return data.signedUrl
}
