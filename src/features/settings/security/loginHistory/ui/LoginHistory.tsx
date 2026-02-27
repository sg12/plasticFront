import { Skeleton } from "@/shared/ui/skeleton"
import { Monitor, Smartphone, Tablet, XCircle, Check, History } from "lucide-react"
import { useLoginHistory, type LoginRecord } from "../hooks/useLoginHistory"
import { ScrollArea } from "@/shared/ui/scrollArea"

export const LoginHistory = () => {
  const { history, isLoading } = useLoginHistory()

  if (isLoading) {
    return (
      <div className="space-child">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <History />
        <p className="text-muted-foreground text-sm font-medium">История входов пуста</p>
        <p className="text-muted-foreground mt-1 text-xs">
          История входов в аккаунт будет отображаться здесь
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[162px]">
      <div className="space-y-2">
        {history.map((record) => (
          <LoginRecordItem key={record.id} record={record} />
        ))}
      </div>
    </ScrollArea>
  )
}

function LoginRecordItem({ record }: { record: LoginRecord }) {
  const Icon = getDeviceIcon(record.device)
  const date = new Date(record.createdAt)

  return (
    <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {record.browser || "Неизвестный браузер"} · {record.os || "Неизвестная ОС"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            в {date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            {record.ipAddress && (
              <span className="text-muted-foreground/70 ml-1.5">· {record.ipAddress}</span>
            )}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        {record.success ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
      </div>
    </div>
  )
}

function getDeviceIcon(device: string | null) {
  switch (device) {
    case "Мобильный":
      return Smartphone
    case "Планшет":
      return Tablet
    default:
      return Monitor
  }
}
