import { cn } from "@/shared/lib/utils"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { RefreshCw, MessageSquare } from "lucide-react"
import { TicketCard } from "./TicketCard"
import { useSupport } from "../hooks/useSupport"

export const SupportReplies = () => {
  const { refreshReplies, isLoadingReplies, isLoadingTickets, ticketsError, tickets } = useSupport()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="mb-1.5">Мои обращения</CardTitle>
            <CardDescription>История ваших обращений в поддержку</CardDescription>
          </div>
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refreshReplies()}
              disabled={isLoadingReplies || isLoadingTickets}
              aria-label="Обновить список обращений"
            >
              <RefreshCw
                className={cn((isLoadingReplies || isLoadingTickets) && "animate-spin", "h-4 w-4")}
              />
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingReplies || isLoadingTickets ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : ticketsError ? (
          <Alert variant="destructive">
            <AlertDescription>{ticketsError}</AlertDescription>
          </Alert>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <MessageSquare className="text-muted-foreground mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm font-medium">Нет обращений</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Ваши обращения в поддержку будут отображаться здесь
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
