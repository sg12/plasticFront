import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { TicketCard } from "./TicketCard"
import { ErrorState } from "@/shared/ui/errorState"
import { EmptyState } from "@/shared/ui/emptyState"
import { useSupport } from "@/features/support/hooks/useSupport"

export const SupportReplies = () => {
  const {
    refreshTickets,
    isLoading,
    isFetching,
    error,
    tickets
  } = useSupport()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои обращения</CardTitle>
        <CardDescription>
          История и статус ваших запросов
        </CardDescription>
        <CardAction>
          <Button
            variant="secondary"
            size="iconMd"
            className="shrink-0 h-9 w-9"
            onClick={() => refreshTickets()}
            disabled={isLoading || isFetching}
            aria-label="Обновить список"
          >
            <RefreshCw
              className={cn("h-4 w-4", isLoading || isFetching && "animate-spin")}
            />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
          </div>
        ) : error ? (
          <ErrorState error={error} />
        ) : tickets && tickets.length > 0 ? (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <EmptyState title="Здесь будут отображаться ваши вопросы к поддержке" />
        )}
      </CardContent>
    </Card>
  )
}