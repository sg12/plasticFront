/**
 * @fileoverview Типы и интерфейсы для работы с уведомлениями
 *
 * Этот файл определяет все TypeScript типы и интерфейсы,
 * которые используются для работы с уведомлениями.
 *
 * @module entities/notification/types/types
 */

import type { updateNotificationSchema } from "../model/schema"
import type z from "zod"

/**
 * Типы уведомлений
 */
export type NotificationType =
  | "appointment_created"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_completed"
  | "support_reply"
  | "support_ticket_created"
  | "moderation_status_changed"
  | "system"

/**
 * Метаданные для уведомления о записи
 */
export interface AppointmentNotificationMetadata {
  appointmentId: string
  doctorId?: string | null
  clinicId?: string | null
  patientId: string
  dateTime: string
}

/**
 * Метаданные для уведомления о поддержке
 */
export interface SupportNotificationMetadata {
  ticketId: string
  replyId?: string
}

/**
 * Метаданные для уведомления о модерации
 */
export interface ModerationNotificationMetadata {
  profileId: string
  previousStatus: string
  newStatus: string
}

/**
 * Метаданные для системного уведомления
 */
export interface SystemNotificationMetadata {
  [key: string]: unknown
}

/**
 * Union тип метаданных уведомлений
 */
export type NotificationMetadata =
  | AppointmentNotificationMetadata
  | SupportNotificationMetadata
  | ModerationNotificationMetadata
  | SystemNotificationMetadata

/**
 * Основная модель уведомления
 */
export interface Notification {
  /** Уникальный идентификатор уведомления */
  id: string
  /** ID пользователя, которому предназначено уведомление */
  userId: string
  /** Тип уведомления */
  type: NotificationType
  /** Заголовок уведомления */
  title: string
  /** Текст сообщения уведомления */
  message: string
  /** Метаданные уведомления (дополнительная информация) */
  metadata: NotificationMetadata | null
  /** Прочитано ли уведомление */
  read: boolean
  /** Дата создания уведомления (ISO строка) */
  createdAt: string
  /** Дата последнего обновления (ISO строка) */
  updatedAt: string
}

/**
 * Данные для обновления уведомления
 */
export type NotificationUpdateData = z.infer<typeof updateNotificationSchema>

/**
 * Параметры фильтрации уведомлений
 */
export interface NotificationFilters {
  /** Фильтр по типу уведомления */
  type?: NotificationType | NotificationType[]
  /** Фильтр по статусу прочтения */
  read?: boolean
  /** Фильтр по дате начала (ISO строка) */
  dateFrom?: string
  /** Фильтр по дате окончания (ISO строка) */
  dateTo?: string
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  /** Номер страницы (начинается с 1) */
  page?: number
  /** Количество элементов на странице */
  limit?: number
}

/**
 * Результат запроса с пагинацией
 */
export interface PaginatedNotifications {
  /** Список уведомлений */
  notifications: Notification[]
  /** Общее количество уведомлений */
  total: number
  /** Номер текущей страницы */
  page: number
  /** Количество элементов на странице */
  limit: number
  /** Общее количество страниц */
  totalPages: number
}
