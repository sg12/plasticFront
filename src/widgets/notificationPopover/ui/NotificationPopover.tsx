import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Button } from "@/shared/ui/button"
import { Bell, CheckCircle2, Clock, X } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { ScrollArea } from "@/shared/ui/scrollArea"
import { Badge } from "@/shared/ui/badge"
import { useNotificationStore } from "@/entities/notification/model/store"
import { useAuthStore } from "@/entities/auth/model/store"
import type { NotificationType } from "@/entities/notification/types/types"

export const NotificationPopover = () => {
  const { user } = useAuthStore()
  const {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = useNotificationStore()

  const [open, setOpen] = React.useState(false)

  // Загрузка уведомлений при монтировании
  React.useEffect(() => {
    if (user?.id) {
      loadNotifications()
      subscribeToNotifications(user.id)
    }

    return () => {
      unsubscribeFromNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "appointment_confirmed":
      case "appointment_completed":
        return CheckCircle2
      case "appointment_cancelled":
        return Clock
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "appointment_confirmed":
      case "appointment_completed":
        return "text-green-600"
      case "appointment_cancelled":
        return "text-yellow-600"
      case "support_reply":
      case "support_ticket_created":
        return "text-blue-600"
      case "moderation_status_changed":
        return "text-purple-600"
      default:
        return "text-blue-600"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "только что"
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    return `${days} дн назад`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconMd" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-3 flex h-2 min-w-2 animate-pulse items-center justify-center rounded-full p-0 text-xs"
            />
          )}
          <span className="sr-only">Уведомления</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-80 p-0" sideOffset={8}>
        <div className="flex max-h-[600px] flex-col">
          <div className="space-child border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Уведомления</h2>
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
            </div>
            {notifications.length > 0 && (
              <div className="space-child grid">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0 || isLoading}
                >
                  Отметить все как прочитанные
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={deleteAllNotifications}
                  disabled={isLoading}
                >
                  Очистить
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="no-scrollbar flex-1 overflow-y-auto">
            <div className="p-2">
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="text-muted-foreground/50 mb-4 size-12 animate-pulse" />
                  <p className="text-muted-foreground text-sm">Загрузка уведомлений...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="text-muted-foreground/50 mb-4 size-12" />
                  <p className="text-muted-foreground text-sm">Нет уведомлений</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    const colorClass = getNotificationColor(notification.type)

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative rounded-lg p-3 transition-colors",
                          !notification.read && "bg-accent/50",
                          "hover:bg-accent",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "bg-accent mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                              colorClass,
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "text-sm font-medium",
                                    !notification.read && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {notification.message}
                                </p>
                                <p className="text-muted-foreground/70 mt-1 text-xs">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="iconSm"
                                    className="h-6 w-6"
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={isLoading}
                                    title="Отметить как прочитанное"
                                  >
                                    <CheckCircle2 className="size-3.5" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="iconSm"
                                  className="text-destructive hover:text-destructive h-6 w-6"
                                  onClick={() => deleteNotification(notification.id)}
                                  disabled={isLoading}
                                  title="Удалить"
                                >
                                  <X className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="bg-primary absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
