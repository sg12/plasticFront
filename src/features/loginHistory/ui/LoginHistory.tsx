import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Monitor, Smartphone, Tablet, RefreshCw, XCircle, Check } from "lucide-react"
import { useLoginHistory, type LoginRecord } from "../hooks/useLoginHistory"

export const LoginHistory = () => {
  const { history, isLoading, refresh } = useLoginHistory()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
        История входов пуста
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {history.map((record) => (
          <LoginRecordItem key={record.id} record={record} />
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => refresh()} disabled={isLoading}>
        <RefreshCw className="h-4 w-4" />
        Обновить
      </Button>
    </div>
  )
}

function LoginRecordItem({ record }: { record: LoginRecord }) {
  const Icon = getDeviceIcon(record.device)
  const date = new Date(record.created_at)

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {record.browser || "Неизвестный браузер"} · {record.os || "Неизвестная ОС"}
          </p>
          <p className="text-xs text-gray-500">
            {date.toLocaleDateString("ru-RU")} в{" "}
            {date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            {record.ip_address && <> · {record.ip_address}</>}
          </p>
        </div>
      </div>
      {record.success ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
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
