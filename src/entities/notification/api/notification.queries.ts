import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  markAsAllReadNotification,
  markAsReadNotification,
  deleteNotification,
} from "./notification.api"

export const notificationKeys = {
  all: ["notifications"] as const,
}

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    staleTime: 30 * 1000,
  })
}

export const useMarkAllRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAsAllReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markAsReadNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
