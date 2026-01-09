import { SUPPORT_TICKET_STATUSES } from "@/entities/support/model/constants"
import { useSupport } from "../hooks/useSupport"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {
  ChevronDown,
  ChevronUp,
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
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
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
            >
              {SUPPORT_TICKET_STATUSES[ticket.status as keyof typeof SUPPORT_TICKET_STATUSES]}
            </Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{ticket.message}</p>
          <div className="mt-3 items-center gap-4 text-xs text-gray-500 lg:flex">
            <span>
              Создано:{" "}
              {format(new Date(ticket.createdAt), "dd MMMM yyyy, HH:mm", {
                locale: ru,
              })}
            </span>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {ticket.attachments.length} файл(ов)
              </span>
            )}
          </div>

          {isExpanded && (
            <div className="space-child mt-4 border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquareReply className="h-4 w-4" />
                Ответы модерации
              </div>
              {isLoadingReplies ? (
                <div className="py-2 text-center text-sm text-gray-500">Загрузка ответов...</div>
              ) : replies && replies.length > 0 ? (
                <div className="space-child">
                  {replies.map((reply) => (
                    <div key={reply.id} className="rounded-lg bg-purple-50 p-3 text-sm">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium text-purple-700">
                          {reply.isFromModerator ? "Модератор" : "Вы"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(reply.createdAt), "dd MMM yyyy, HH:mm", {
                            locale: ru,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2 text-sm text-gray-500">Пока нет ответов от модерации</div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Скрыть ответы
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Показать ответы
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isDeleting}
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
