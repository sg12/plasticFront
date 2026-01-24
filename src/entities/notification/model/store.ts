/**
 * @fileoverview Store для работы с уведомлениями
 *
 * @module entities/notification/model/store
 */

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { Notification, NotificationFilters, PaginationParams } from "../types/types"
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../api/api"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { logger } from "@/shared/lib/logger"
import { supabase } from "@/shared/api/supabase/client"
import { NOTIFICATIONS_TABLE } from "./constants"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  _subscription: RealtimeChannel | null

  // Методы для работы с уведомлениями
  loadNotifications: (filters?: NotificationFilters, pagination?: PaginationParams) => Promise<void>
  refreshNotifications: (
    filters?: NotificationFilters,
    pagination?: PaginationParams,
  ) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  deleteAllNotifications: () => Promise<void>
  loadUnreadCount: () => Promise<void>

  // Real-time подписка
  subscribeToNotifications: (userId: string) => void
  unsubscribeFromNotifications: () => void

  // Утилиты
  clearError: () => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>()(
  immer((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    _subscription: null,

    loadNotifications: async (filters = {}, pagination = {}) => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        logger.warn("Попытка загрузить уведомления без авторизации")
        return
      }

      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const result = await getNotifications(user.id, filters, pagination)
        set((state) => {
          state.notifications = result.notifications
          state.isLoading = false
          state.error = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки уведомлений"
        set((state) => {
          state.error = errorMessage
          state.isLoading = false
        })
        logger.error("Ошибка загрузки уведомлений в store", error as Error, {
          filters,
          pagination,
        })
      }
    },

    refreshNotifications: async (filters = {}, pagination = {}) => {
      await get().loadNotifications(filters, pagination)
      await get().loadUnreadCount()
    },

    markAsRead: async (notificationId: string) => {
      const currentNotifications = get().notifications
      const notification = currentNotifications.find((n) => n.id === notificationId)

      // Оптимистичное обновление
      if (notification && !notification.read) {
        set((state) => {
          const index = state.notifications.findIndex((n) => n.id === notificationId)
          if (index !== -1) {
            state.notifications[index].read = true
          }
          if (state.unreadCount > 0) {
            state.unreadCount -= 1
          }
        })
      }

      try {
        await markAsRead(notificationId)
      } catch (error) {
        // Откатываем оптимистичное обновление при ошибке
        if (notification) {
          set((state) => {
            const index = state.notifications.findIndex((n) => n.id === notificationId)
            if (index !== -1) {
              state.notifications[index].read = false
            }
            state.unreadCount += 1
          })
        }

        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при отметке уведомления"
        toast.error(errorMessage)
        logger.error("Ошибка отметки уведомления как прочитанного в store", error as Error, {
          notificationId,
        })
        throw error
      }
    },

    markAllAsRead: async () => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        logger.warn("Попытка отметить все уведомления без авторизации")
        return
      }

      const currentUnreadCount = get().unreadCount

      // Оптимистичное обновление
      set((state) => {
        state.notifications.forEach((n) => {
          n.read = true
        })
        state.unreadCount = 0
      })

      try {
        await markAllAsRead(user.id)
        toast.success("Все уведомления отмечены как прочитанные")
      } catch (error) {
        // Откатываем оптимистичное обновление
        set((state) => {
          state.notifications.forEach((n) => {
            if (state.notifications.indexOf(n) < currentUnreadCount) {
              n.read = false
            }
          })
          state.unreadCount = currentUnreadCount
        })

        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при отметке всех уведомлений"
        toast.error(errorMessage)
        logger.error("Ошибка отметки всех уведомлений как прочитанных в store", error as Error, {
          userId: user?.id,
        })
        throw error
      }
    },

    deleteNotification: async (notificationId: string) => {
      const notification = get().notifications.find((n) => n.id === notificationId)
      const wasUnread = notification && !notification.read

      // Оптимистичное обновление
      set((state) => {
        state.notifications = state.notifications.filter((n) => n.id !== notificationId)
        if (wasUnread && state.unreadCount > 0) {
          state.unreadCount -= 1
        }
      })

      try {
        await deleteNotification(notificationId)
      } catch (error) {
        // Откатываем оптимистичное обновление
        if (notification) {
          set((state) => {
            state.notifications.push(notification)
            if (wasUnread) {
              state.unreadCount += 1
            }
          })
        }

        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при удалении уведомления"
        toast.error(errorMessage)
        logger.error("Ошибка удаления уведомления в store", error as Error, {
          notificationId,
        })
        throw error
      }
    },

    deleteAllNotifications: async () => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        logger.warn("Попытка удалить все уведомления без авторизации")
        return
      }

      const previousNotifications = [...get().notifications]
      const previousUnreadCount = get().unreadCount

      // Оптимистичное обновление
      set((state) => {
        state.notifications = []
        state.unreadCount = 0
      })

      try {
        await deleteAllNotifications(user.id)
        toast.success("Все уведомления удалены")
      } catch (error) {
        // Откатываем оптимистичное обновление
        set((state) => {
          state.notifications = previousNotifications
          state.unreadCount = previousUnreadCount
        })

        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при удалении всех уведомлений"
        toast.error(errorMessage)
        logger.error("Ошибка удаления всех уведомлений в store", error as Error, {
          userId: user?.id,
        })
        throw error
      }
    },

    loadUnreadCount: async () => {
      const { user } = useAuthStore.getState()

      if (!user?.id) {
        set((state) => {
          state.unreadCount = 0
        })
        return
      }

      try {
        const count = await getUnreadCount(user.id)
        set((state) => {
          state.unreadCount = count
        })
      } catch (error) {
        logger.error(
          "Ошибка загрузки количества непрочитанных уведомлений в store",
          error as Error,
          {
            userId: user?.id,
          },
        )
      }
    },

    subscribeToNotifications: (userId: string) => {
      // Отписываемся от предыдущей подписки, если есть
      const currentSubscription = get()._subscription
      if (currentSubscription) {
        supabase.removeChannel(currentSubscription)
      }

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: NOTIFICATIONS_TABLE,
            filter: `userId=eq.${userId}`,
          },
          (payload) => {
            logger.debug("Real-time событие уведомления", { event: payload.eventType, payload })

            if (payload.eventType === "INSERT") {
              // Новое уведомление
              const newNotification = payload.new as Notification
              set((state) => {
                state.notifications.unshift(newNotification)
                if (!newNotification.read) {
                  state.unreadCount += 1
                }
              })
            } else if (payload.eventType === "UPDATE") {
              // Обновление уведомления
              const updatedNotification = payload.new as Notification
              const oldNotification = payload.old as Notification

              set((state) => {
                const index = state.notifications.findIndex((n) => n.id === updatedNotification.id)
                if (index !== -1) {
                  state.notifications[index] = updatedNotification
                } else {
                  // Если уведомления нет в списке, добавляем его
                  state.notifications.unshift(updatedNotification)
                }

                // Обновляем счетчик непрочитанных
                if (oldNotification.read !== updatedNotification.read) {
                  if (updatedNotification.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                  } else {
                    state.unreadCount += 1
                  }
                }
              })
            } else if (payload.eventType === "DELETE") {
              // Удаление уведомления
              const deletedNotification = payload.old as Notification

              set((state) => {
                state.notifications = state.notifications.filter(
                  (n) => n.id !== deletedNotification.id,
                )
                if (!deletedNotification.read && state.unreadCount > 0) {
                  state.unreadCount -= 1
                }
              })
            }

            // Обновляем счетчик непрочитанных после изменений
            get().loadUnreadCount()
          },
        )
        .subscribe((status) => {
          logger.debug("Статус подписки на уведомления", { status, userId })
        })

      set((state) => {
        state._subscription = channel
      })
    },

    unsubscribeFromNotifications: () => {
      const subscription = get()._subscription
      if (subscription) {
        supabase.removeChannel(subscription)
        set((state) => {
          state._subscription = null
        })
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    reset: () => {
      get().unsubscribeFromNotifications()
      set((state) => {
        state.notifications = []
        state.unreadCount = 0
        state.isLoading = false
        state.error = null
        state._subscription = null
      })
      logger.debug("Notification store сброшен")
    },
  })),
)
