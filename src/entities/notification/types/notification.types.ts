import type { NOTIFICATION_TYPE } from "../model/notification.constants"

export interface Notification {
  id: string
  userId: string
  type: NOTIFICATION_TYPE
  title: string
  description: string
  isRead: boolean
  payload: JSON | null
  createdAt: string
  updatedAt: string
}

export type NOTIFICATION_TYPE = keyof typeof NOTIFICATION_TYPE
