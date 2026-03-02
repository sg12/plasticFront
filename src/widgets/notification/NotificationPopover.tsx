import { useMemo, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Button } from "@/shared/ui/button"
import { Bell, CheckCircle2, Info, UserPlus } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { ScrollArea } from "@/shared/ui/scrollArea"
import { Badge } from "@/shared/ui/badge"
import { useMarkAllRead, useMarkAsRead, useNotifications } from "@/entities/notification/api/notification.queries"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { NOTIFICATION_TYPE } from "@/entities/notification/model/notification.constants"
import { EmptyState } from "@/shared/ui/emptyState"

export const NotificationPopover = () => {
  const [open, setOpen] = useState(false)

  const { data: notifications = [], isLoading } = useNotifications()
  const { mutateAsync: markAllRead } = useMarkAllRead()
  const { mutateAsync: markAsRead } = useMarkAsRead()

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.isRead).length,
    [notifications])

  const getNotificationIcon = (type: keyof typeof NOTIFICATION_TYPE) => {
    switch (type) {
      case NOTIFICATION_TYPE.APPOINTMENT_MESSAGE: return CheckCircle2
      case NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE: return UserPlus
      case NOTIFICATION_TYPE.SYSTEM_MESSAGE: return Info
      default: return Bell
    }
  }

  const getNotificationColor = (type: keyof typeof NOTIFICATION_TYPE) => {
    switch (type) {
      case NOTIFICATION_TYPE.APPOINTMENT_MESSAGE: return "text-emerald-500 bg-emerald-50"
      case NOTIFICATION_TYPE.RELATIONSHIP_MESSAGE: return "text-red-500 bg-red-50"
      case NOTIFICATION_TYPE.SYSTEM_MESSAGE: return "text-amber-500 bg-amber-50"
      default: return "text-blue-500 bg-blue-50"
    }
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
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => markAllRead()}
              >
                Прочитать все
              </Button>
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
                // <div className="flex flex-col items-center justify-center p-8 text-center">
                //   <Bell className="text-muted-foreground/50 mb-4 size-12" />
                //   <p className="text-muted-foreground text-sm">Нет уведомлений</p>
                // </div>
                <EmptyState title="Нет уведомлений" icon={Bell} />
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
                          !notification.isRead && "bg-accent/50",
                          "hover:bg-accent",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "bg-accent mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                              colorClass
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
                                    !notification.isRead && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {notification.description}
                                </p>
                                <p className="text-muted-foreground/70 mt-1 text-xs">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="iconSm"
                                    onClick={() => markAsRead(notification.id)}
                                    title="Отметить как прочитанное"
                                  >
                                    <CheckCircle2 className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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
