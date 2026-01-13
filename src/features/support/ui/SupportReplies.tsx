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
import { RefreshCw } from "lucide-react"
import { TicketCard } from "./TicketCard"
import { useSupport } from "../hooks/useSupport"

export const SupportReplies = () => {
  const { refreshReplies, isLoadingReplies, isLoadingTickets, ticketsError, tickets } = useSupport()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои обращения</CardTitle>
        <CardDescription>История ваших обращений в поддержку</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refreshReplies()}
            disabled={isLoadingReplies || isLoadingTickets}
          >
            <RefreshCw
              className={cn((isLoadingReplies || isLoadingTickets) && "animate-spin", "h-4 w-4")}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingReplies ? (
          <div className="py-8 text-center text-gray-500">Загрузка...</div>
        ) : ticketsError ? (
          <Alert variant="destructive">
            <AlertDescription>{ticketsError}</AlertDescription>
          </Alert>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-global">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>У вас пока нет обращений в поддержку</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
