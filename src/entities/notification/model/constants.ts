/**
 * @fileoverview Константы для работы с уведомлениями
 *
 * @module entities/notification/model/constants
 */

import type { NotificationType } from "../types/types"

/**
 * Типы уведомлений
 */
export const NOTIFICATION_TYPE = {
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_CONFIRMED: "appointment_confirmed",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_COMPLETED: "appointment_completed",
  SUPPORT_REPLY: "support_reply",
  SUPPORT_TICKET_CREATED: "support_ticket_created",
  MODERATION_STATUS_CHANGED: "moderation_status_changed",
  SYSTEM: "system",
} as const

/**
 * Названия типов уведомлений для отображения
 */
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NOTIFICATION_TYPE.APPOINTMENT_CREATED]: "Новая запись",
  [NOTIFICATION_TYPE.APPOINTMENT_CONFIRMED]: "Запись подтверждена",
  [NOTIFICATION_TYPE.APPOINTMENT_CANCELLED]: "Запись отменена",
  [NOTIFICATION_TYPE.APPOINTMENT_COMPLETED]: "Запись завершена",
  [NOTIFICATION_TYPE.SUPPORT_REPLY]: "Ответ в поддержке",
  [NOTIFICATION_TYPE.SUPPORT_TICKET_CREATED]: "Новое обращение в поддержку",
  [NOTIFICATION_TYPE.MODERATION_STATUS_CHANGED]: "Изменение статуса модерации",
  [NOTIFICATION_TYPE.SYSTEM]: "Системное уведомление",
} as const

/**
 * Название таблицы в базе данных
 */
export const NOTIFICATIONS_TABLE = "notifications"

/**
 * Количество уведомлений на страницу по умолчанию
 */
export const DEFAULT_NOTIFICATIONS_LIMIT = 50
