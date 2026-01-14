import type { RoleProfile } from "@/entities/user/types/types"
import { pluralRu } from "@/shared/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import dayjs from "dayjs"

interface Props {
  profile: RoleProfile | null
}

export const UserProfileHistory = ({ profile }: Props) => {
  const formatWithUs = () => {
    if (!profile?.createdAt) return "—"

    const created = dayjs(profile.createdAt)
    if (!created.isValid()) return "—"

    const now = dayjs()
    if (now.isBefore(created)) return "—"

    let cursor = created
    const years = now.diff(cursor, "year")
    cursor = cursor.add(years, "year")
    const months = now.diff(cursor, "month")
    cursor = cursor.add(months, "month")
    const days = now.diff(cursor, "day")

    const parts: string[] = []
    if (years > 0) parts.push(pluralRu(years, "год", "года", "лет"))
    if (months > 0 && parts.length < 2) {
      parts.push(pluralRu(months, "месяц", "месяца", "месяцев"))
    }
    if (days > 0 && parts.length < 2) {
      parts.push(pluralRu(days, "день", "дня", "дней"))
    }

    return parts.length ? parts.join(" ") : "сегодня"
  }

  const withUsLabel = formatWithUs()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Активность</CardTitle>
          <Badge variant="secondary">Скоро</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-purple-50 p-4 text-center opacity-70">
            <p className="text-lg font-semibold text-purple-700">0</p>
            <p className="text-muted-foreground mt-1 text-xs">Процедур</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center opacity-70">
            <p className="text-lg font-semibold text-blue-700">0</p>
            <p className="text-muted-foreground mt-1 text-xs">Клиник</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center opacity-70">
            <p className="text-lg font-semibold text-green-700">0</p>
            <p className="text-muted-foreground mt-1 text-xs">Врачей</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-lg font-semibold text-orange-700">{withUsLabel}</p>
            <p className="text-muted-foreground mt-1 text-xs">С нами</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
