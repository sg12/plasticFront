import { api } from "@/shared/api/axiosInstance"
import type { Notification } from "../types/notification.types"

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get<Notification[]>("notifications")
  return data
}

export const markAsAllReadNotification = async (): Promise<void> => {
  return await api.post("notifications")
}

export const markAsReadNotification = async (id: string): Promise<void> => {
  return await api.post("notification", {}, { params: id })
}

export const deleteNotification = async (id: string): Promise<void> => {
  return await api.delete("notification", { params: id })
}
