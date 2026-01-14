import { SUPPORT_TICKET_STATUSES } from "@/entities/support/model/constants"
import { useSupport } from "../hooks/useSupport"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {
  ChevronDown,
  MessageSquareReply,
  Paperclip,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/shared/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alertDialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"

export const TicketCard = ({
  ticket: initialTicket,
}: {
  ticket: import("../../../entities/support/types/types").SupportTicket
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { tickets, replies, isLoadingReplies, deleteTicket, isDeleting } = useSupport(
    initialTicket.id,
  )

  // Получаем актуальный статус из списка обращений
  const ticket = tickets.find((t) => t.id === initialTicket.id) || initialTicket

  const handleDelete = async () => {
    try {
      await deleteTicket(ticket.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      // Ошибка уже обработана в deleteTicket
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{ticket.subject}</h3>
            <Badge
              variant={
                ticket.status === "resolved"
                  ? "default"
                  : ticket.status === "inProgress"
                    ? "secondary"
                    : ticket.status === "closed"
                      ? "destructive"
                      : "outline"
              }
              className="text-xs"
            >
              {SUPPORT_TICKET_STATUSES[ticket.status as keyof typeof SUPPORT_TICKET_STATUSES]}
            </Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">{ticket.message}</p>
          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span>
              Создано:{" "}
              {format(new Date(ticket.createdAt), "dd MMMM yyyy, HH:mm", {
                locale: ru,
              })}
            </span>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {ticket.attachments.length} {ticket.attachments.length === 1 ? "файл" : "файлов"}
              </span>
            )}
          </div>

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="group/collapsible mt-3">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                {isExpanded ? "Скрыть ответы" : "Показать ответы"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
              <div className="mt-4 space-y-3 border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquareReply className="h-4 w-4" />
                  Ответы модерации
                </div>
                {isLoadingReplies ? (
                  <div className="text-muted-foreground py-2 text-center text-sm">
                    Загрузка ответов...
                  </div>
                ) : replies && replies.length > 0 ? (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`rounded-lg border p-3 text-sm ${
                          reply.isFromModerator
                            ? "bg-purple-50/50 border-purple-200"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              reply.isFromModerator ? "text-purple-700" : "text-foreground"
                            }`}
                          >
                            {reply.isFromModerator ? "Модератор" : "Вы"}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {format(new Date(reply.createdAt), "dd MMM yyyy, HH:mm", {
                              locale: ru,
                            })}
                          </span>
                        </div>
                        <p className="text-foreground">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-2 text-sm">
                    Пока нет ответов от модерации
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="shrink-0">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isDeleting}
                aria-label="Удалить обращение"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Удалить обращение?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить обращение "{ticket.subject}"? Это действие нельзя
                  отменить. Все связанные файлы и ответы также будут удалены.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
