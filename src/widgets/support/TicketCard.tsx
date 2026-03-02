import { useState } from "react"
import { formatDate } from "date-fns"
import {
  ChevronDown,
  MessageSquareReply,
  Clock
} from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"
import type { Ticket } from "@/entities/support/types/support.types"
import { TICKET_STATUS, TICKET_STATUS_LOCALES } from "@/entities/support/model/support.constants"
import { ru } from "date-fns/locale"

const STATUS_MAP = {
  [TICKET_STATUS.OPEN]: { label: [TICKET_STATUS_LOCALES[TICKET_STATUS.OPEN].ru], variant: "outline" },
  [TICKET_STATUS.IN_PROGRESS]: { label: [TICKET_STATUS_LOCALES[TICKET_STATUS.IN_PROGRESS].ru], variant: "secondary" },
  [TICKET_STATUS.RESOLVED]: { label: [TICKET_STATUS_LOCALES[TICKET_STATUS.RESOLVED].ru], variant: "primary" },
  [TICKET_STATUS.CLOSED]: { label: [TICKET_STATUS_LOCALES[TICKET_STATUS.CLOSED].ru], variant: "destructive" },
} as const

export const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusInfo = STATUS_MAP[ticket.status as keyof typeof STATUS_MAP]

  return (
    <div className="bg-card hover:bg-muted/20 rounded-lg border p-4 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-none tracking-tight">
              {ticket.title}
            </h3>
            <Badge variant={statusInfo.variant} className="text-[10px] uppercase tracking-wider">
              {statusInfo.label}
            </Badge>
          </div>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(ticket.createdAt, "dd MMMM yyyy, HH:mm", {locale: ru})}
            </span>
          </div>

          {/* Ответы */}
          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-primary hover:text-primary/80 px-0 hover:bg-transparent"
              >
                <ChevronDown className={`mr-1 h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                {isExpanded ? "Скрыть переписку" : "Показать переписку"}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <MessageSquareReply className="h-3.5 w-3.5" />
                История сообщений
              </div>

              {ticket.messages && ticket.messages.length > 0 ? (
                <div className="relative space-y-3 pl-3 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted">
                  {ticket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-lg border p-3 text-sm ${message.senderId
                        ? "border-primary/20 bg-primary/5"
                        : "bg-muted/30"
                        }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className={`font-bold ${message.senderId ? "text-primary" : ""}`}>
                          {message.type === "USER" ? "Вы" : "Поддержка"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(message.createdAt, "dd MMM, HH:mm")}
                        </span>
                      </div>
                      <p className="text-foreground/90">{message.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-2 text-sm italic">
                  Ожидайте ответа специалиста...
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}