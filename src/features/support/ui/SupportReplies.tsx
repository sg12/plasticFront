import { cn } from "@/shared/lib/utils"
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
import { RefreshCw, MessageSquare, AlertCircle } from "lucide-react"
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
              size="iconSm"
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
          <div className="flex min-h-[200px] flex-col items-center justify-center px-4 py-8">
            <div className="max-w-md text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 rounded-full p-4">
                  <AlertCircle className="text-destructive h-8 w-8" />
                </div>
              </div>
              <h3 className="text-destructive mb-2 text-lg font-semibold">
                Не удалось загрузить обращения
              </h3>
              <p className="text-muted-foreground mb-1 text-sm">
                {ticketsError.includes("network") || ticketsError.includes("fetch")
                  ? "Проблема с подключением к серверу. Проверьте ваше интернет-соединение."
                  : ticketsError.includes("timeout")
                    ? "Превышено время ожидания. Попробуйте обновить страницу."
                    : ticketsError}
              </p>
              <p className="text-muted-foreground mb-4 text-xs">
                Если проблема сохраняется, попробуйте обновить страницу или обратитесь в поддержку.
              </p>
              <Button
                onClick={() => refreshReplies()}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Попробовать снова
              </Button>
            </div>
          </div>
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
