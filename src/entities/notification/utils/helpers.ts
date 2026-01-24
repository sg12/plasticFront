/**
 * @fileoverview Вспомогательные функции для создания типичных уведомлений
 *
 * @module entities/notification/api/helpers
 */

import { createNotification } from "../api/api"
import { NOTIFICATION_TYPE } from "../model/constants"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import type { User } from "@supabase/supabase-js"

/**
 * Создание уведомления о новой записи
 */
export const createAppointmentCreatedNotification = async (
  userId: User["id"],
  appointmentId: string,
  dateTime: string,
  doctorName?: string | null,
  clinicName?: string | null,
): Promise<void> => {
  const date = new Date(dateTime)
  const formattedDate = format(date, "d MMMM 'в' HH:mm", { locale: ru })

  await createNotification(userId, {
    type: NOTIFICATION_TYPE.APPOINTMENT_CREATED,
    title: "Новая запись",
    message: `У вас новая запись ${doctorName || clinicName ? `к ${doctorName || clinicName}` : ""} на ${formattedDate}`,
    metadata: {
      appointmentId,
      dateTime,
      doctorName: doctorName || null,
      clinicName: clinicName || null,
    },
  })
}

/**
 * Создание уведомления о подтверждении записи
 */
export const createAppointmentConfirmedNotification = async (
  userId: User["id"],
  appointmentId: string,
  dateTime: string,
  doctorName?: string | null,
  clinicName?: string | null,
): Promise<void> => {
  const date = new Date(dateTime)
  const formattedDate = format(date, "d MMMM 'в' HH:mm", { locale: ru })

  await createNotification(userId, {
    type: NOTIFICATION_TYPE.APPOINTMENT_CONFIRMED,
    title: "Запись подтверждена",
    message: `Ваша запись ${doctorName || clinicName ? `к ${doctorName || clinicName}` : ""} на ${formattedDate} подтверждена`,
    metadata: {
      appointmentId,
      dateTime,
      doctorName: doctorName || null,
      clinicName: clinicName || null,
    },
  })
}

/**
 * Создание уведомления об отмене записи
 */
export const createAppointmentCancelledNotification = async (
  userId: User["id"],
  appointmentId: string,
  dateTime: string,
  doctorName?: string | null,
  clinicName?: string | null,
  reason?: string | null,
): Promise<void> => {
  const date = new Date(dateTime)
  const formattedDate = format(date, "d MMMM 'в' HH:mm", { locale: ru })

  await createNotification(userId, {
    type: NOTIFICATION_TYPE.APPOINTMENT_CANCELLED,
    title: "Запись отменена",
    message: `Запись ${doctorName || clinicName ? `к ${doctorName || clinicName}` : ""} на ${formattedDate} отменена${reason ? `. Причина: ${reason}` : ""}`,
    metadata: {
      appointmentId,
      dateTime,
      doctorName: doctorName || null,
      clinicName: clinicName || null,
      reason: reason || null,
    },
  })
}

/**
 * Создание уведомления о завершении записи
 */
export const createAppointmentCompletedNotification = async (
  userId: User["id"],
  appointmentId: string,
  dateTime: string,
): Promise<void> => {
  await createNotification(userId, {
    type: NOTIFICATION_TYPE.APPOINTMENT_COMPLETED,
    title: "Запись завершена",
    message: "Ваша запись успешно завершена",
    metadata: {
      appointmentId,
      dateTime,
    },
  })
}

/**
 * Создание уведомления об ответе в поддержке
 */
export const createSupportReplyNotification = async (
  userId: User["id"],
  ticketId: string,
  replyId: string,
): Promise<void> => {
  await createNotification(userId, {
    type: NOTIFICATION_TYPE.SUPPORT_REPLY,
    title: "Ответ в поддержке",
    message: "Вы получили ответ на ваше обращение в поддержку",
    metadata: {
      ticketId,
      replyId,
    },
  })
}

/**
 * Создание уведомления о новом обращении в поддержке
 */
export const createSupportTicketCreatedNotification = async (
  userId: User["id"],
  ticketId: string,
): Promise<void> => {
  await createNotification(userId, {
    type: NOTIFICATION_TYPE.SUPPORT_TICKET_CREATED,
    title: "Новое обращение создано",
    message: "Ваше обращение в поддержку успешно создано и принято в обработку",
    metadata: {
      ticketId,
    },
  })
}

/**
 * Создание уведомления об изменении статуса модерации
 */
export const createModerationStatusChangedNotification = async (
  userId: User["id"],
  profileId: string,
  previousStatus: string,
  newStatus: string,
): Promise<void> => {
  const statusLabels: Record<string, string> = {
    pending: "Ожидает модерации",
    approved: "Одобрен",
    rejected: "Отклонен",
  }

  await createNotification(userId, {
    type: NOTIFICATION_TYPE.MODERATION_STATUS_CHANGED,
    title: "Изменение статуса модерации",
    message: `Статус вашего профиля изменен: ${statusLabels[previousStatus] || previousStatus} → ${statusLabels[newStatus] || newStatus}`,
    metadata: {
      profileId,
      previousStatus,
      newStatus,
    },
  })
}

/**
 * Создание системного уведомления
 */
export const createSystemNotification = async (
  userId: User["id"],
  title: string,
  message: string,
  metadata?: Record<string, unknown>,
): Promise<void> => {
  await createNotification(userId, {
    type: NOTIFICATION_TYPE.SYSTEM,
    title,
    message,
    metadata: metadata || null,
  })
}
