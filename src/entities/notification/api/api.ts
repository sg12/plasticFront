/**
 * @fileoverview API методы для работы с уведомлениями
 *
 * @module entities/notification/api/api
 */

import { supabase } from "@/shared/api/supabase/client"
import type {
  Notification,
  NotificationFilters,
  PaginationParams,
  PaginatedNotifications,
  NotificationType,
  NotificationMetadata,
} from "../types/types"
import { logger } from "@/shared/lib/logger"
import type { User } from "@supabase/supabase-js"
import { NOTIFICATIONS_TABLE, DEFAULT_NOTIFICATIONS_LIMIT } from "../model/constants"
import { createNotificationSchema } from "../model/schema"

/**
 * Создание нового уведомления
 */
export const createNotification = async (
  userId: User["id"],
  data: {
    type: NotificationType
    title: string
    message: string
    metadata?: NotificationMetadata | null
    read?: boolean
  },
): Promise<Notification> => {
  logger.debug("Создание уведомления", { userId, type: data.type })

  // Валидация данных
  const validatedData = createNotificationSchema.parse({
    userId,
    ...data,
  })

  const { data: notification, error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .insert({
      userId: validatedData.userId,
      type: validatedData.type,
      title: validatedData.title,
      message: validatedData.message,
      metadata: validatedData.metadata || null,
      read: validatedData.read ?? false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что RLS политики настроены правильно для создания уведомлений.",
      )
    }
    logger.error("Ошибка создания уведомления", new Error(error.message), {
      userId,
      type: data.type,
    })
    throw error
  }

  if (!notification) {
    logger.error("Не удалось создать уведомление", new Error("No data returned"), { userId })
    throw new Error("Не удалось создать уведомление")
  }

  logger.debug("Уведомление успешно создано", { notificationId: notification.id, userId })

  return notification as Notification
}

/**
 * Получение уведомлений пользователя с пагинацией
 */
export const getNotifications = async (
  userId: User["id"],
  filters?: NotificationFilters,
  pagination?: PaginationParams,
): Promise<PaginatedNotifications> => {
  logger.debug("Получение уведомлений", { userId, filters, pagination })

  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? DEFAULT_NOTIFICATIONS_LIMIT
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from(NOTIFICATIONS_TABLE)
    .select("*", { count: "exact" })
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .range(from, to)

  // Применяем фильтры
  if (filters?.type) {
    if (Array.isArray(filters.type)) {
      query = query.in("type", filters.type)
    } else {
      query = query.eq("type", filters.type)
    }
  }

  if (filters?.read !== undefined) {
    query = query.eq("read", filters.read)
  }

  if (filters?.dateFrom) {
    query = query.gte("createdAt", filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte("createdAt", filters.dateTo)
  }

  const { data, error, count } = await query

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка получения уведомлений", new Error(error.message), { userId })
    throw error
  }

  const notifications = (data as Notification[]) || []
  const total = count ?? 0
  const totalPages = Math.ceil(total / limit)

  logger.debug("Уведомления получены", { userId, count: notifications.length, total })

  return {
    notifications,
    total,
    page,
    limit,
    totalPages,
  }
}

/**
 * Получение количества непрочитанных уведомлений
 */
export const getUnreadCount = async (userId: User["id"]): Promise<number> => {
  logger.debug("Получение количества непрочитанных уведомлений", { userId })

  const { count, error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .eq("read", false)

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка получения количества непрочитанных", new Error(error.message), { userId })
    throw error
  }

  return count ?? 0
}

/**
 * Отметить уведомление как прочитанное
 */
export const markAsRead = async (notificationId: string): Promise<Notification> => {
  logger.debug("Отметка уведомления как прочитанного", { notificationId })

  const { data, error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .update({ read: true, updatedAt: new Date().toISOString() })
    .eq("id", notificationId)
    .select()
    .single()

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка отметки уведомления как прочитанного", new Error(error.message), {
      notificationId,
    })
    throw error
  }

  if (!data) {
    logger.error("Уведомление не найдено", new Error("No data returned"), { notificationId })
    throw new Error("Уведомление не найдено")
  }

  logger.debug("Уведомление отмечено как прочитанное", { notificationId })

  return data as Notification
}

/**
 * Отметить все уведомления пользователя как прочитанные
 */
export const markAllAsRead = async (userId: User["id"]): Promise<void> => {
  logger.debug("Отметка всех уведомлений как прочитанных", { userId })

  const { error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .update({ read: true, updatedAt: new Date().toISOString() })
    .eq("userId", userId)
    .eq("read", false)

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка отметки всех уведомлений как прочитанных", new Error(error.message), {
      userId,
    })
    throw error
  }

  logger.debug("Все уведомления отмечены как прочитанные", { userId })
}

/**
 * Удалить уведомление
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  logger.debug("Удаление уведомления", { notificationId })

  const { error } = await supabase.from(NOTIFICATIONS_TABLE).delete().eq("id", notificationId)

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка удаления уведомления", new Error(error.message), { notificationId })
    throw error
  }

  logger.debug("Уведомление удалено", { notificationId })
}

/**
 * Удалить все уведомления пользователя
 */
export const deleteAllNotifications = async (userId: User["id"]): Promise<void> => {
  logger.debug("Удаление всех уведомлений", { userId })

  const { error } = await supabase.from(NOTIFICATIONS_TABLE).delete().eq("userId", userId)

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка удаления всех уведомлений", new Error(error.message), { userId })
    throw error
  }

  logger.debug("Все уведомления удалены", { userId })
}
