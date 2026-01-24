/**
 * @fileoverview Zod схемы для валидации данных уведомлений
 *
 * @module entities/notification/model/schema
 */

import { z } from "zod"
import { NOTIFICATION_TYPE } from "./constants"

/**
 * Схема для обновления уведомления
 */
export const updateNotificationSchema = z.object({
  /** Прочитано ли уведомление */
  read: z.boolean().optional(),
})

/**
 * Схема для создания уведомления (для внутреннего использования)
 */
export const createNotificationSchema = z.object({
  /** ID пользователя, которому предназначено уведомление */
  userId: z.uuid("Неверный формат UUID пользователя"),
  /** Тип уведомления */
  type: z.enum(
    [
      NOTIFICATION_TYPE.APPOINTMENT_CREATED,
      NOTIFICATION_TYPE.APPOINTMENT_CONFIRMED,
      NOTIFICATION_TYPE.APPOINTMENT_CANCELLED,
      NOTIFICATION_TYPE.APPOINTMENT_COMPLETED,
      NOTIFICATION_TYPE.SUPPORT_REPLY,
      NOTIFICATION_TYPE.SUPPORT_TICKET_CREATED,
      NOTIFICATION_TYPE.MODERATION_STATUS_CHANGED,
      NOTIFICATION_TYPE.SYSTEM,
    ],
    { message: "Неверный тип уведомления" },
  ),
  /** Заголовок уведомления */
  title: z.string().min(1, "Заголовок обязателен").max(200, "Заголовок слишком длинный"),
  /** Текст сообщения уведомления */
  message: z.string().min(1, "Сообщение обязательно").max(1000, "Сообщение слишком длинное"),
  /** Метаданные уведомления (дополнительная информация) */
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  /** Прочитано ли уведомление */
  read: z.boolean().default(false).optional(),
})
