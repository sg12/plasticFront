import { SUPPORT_TICKET_STATUSES } from "@/features/support/model/constants"
import { useTicketReplies } from "../hooks/useSupport"
import { useSupportTickets } from "../hooks/useSupport"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronDown, ChevronUp, MessageSquareReply, Paperclip } from "lucide-react"
import { useState } from "react"

export const TicketCard = ({
  ticket: initialTicket,
}: {
  ticket: import("../model/types").SupportTicket
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { tickets } = useSupportTickets()
  const { replies, isLoading: isLoadingReplies } = useTicketReplies(
    isExpanded ? initialTicket.id : null,
  )

  // Получаем актуальный статус из списка обращений
  const ticket = tickets.find((t) => t.id === initialTicket.id) || initialTicket

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{ticket.subject}</h3>
            <Badge
              variant={
                ticket.status === "resolved" || ticket.status === "closed"
                  ? "default"
                  : ticket.status === "in_progress"
                    ? "secondary"
                    : "outline"
              }
            >
              {SUPPORT_TICKET_STATUSES[ticket.status as keyof typeof SUPPORT_TICKET_STATUSES]}
            </Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{ticket.message}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span>
              Создано:{" "}
              {format(new Date(ticket.created_at), "dd MMMM yyyy, HH:mm", {
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
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquareReply className="h-4 w-4" />
                Ответы модерации
              </div>
              {isLoadingReplies ? (
                <div className="py-2 text-center text-sm text-gray-500">Загрузка ответов...</div>
              ) : replies && replies.length > 0 ? (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div key={reply.id} className="rounded-lg bg-purple-50 p-3 text-sm">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium text-purple-700">
                          {reply.is_from_moderator ? "Модератор" : "Вы"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(reply.created_at), "dd MMM yyyy, HH:mm", {
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
      </div>
    </div>
  )
}
