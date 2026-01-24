import type { RoleProfile } from "@/entities/user/types/types"
import { pluralRu } from "@/shared/lib/utils"
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  isBefore,
  isValid,
  parseISO,
} from "date-fns"

interface Props {
  profile: RoleProfile | null
}

export const UserProfileHistory = ({ profile }: Props) => {
  const formatWithUs = () => {
    if (!profile?.createdAt) return "—"

    const created = parseISO(profile.createdAt)
    if (!isValid(created)) return "—"

    const now = new Date()
    if (isBefore(now, created)) return "—"

    const years = differenceInYears(now, created)
    const months = differenceInMonths(now, created) % 12
    const days = differenceInDays(now, created) % 30

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
    <>
      <div className="flex items-center justify-between gap-2 mb-4">
        <CardTitle>Активность</CardTitle>
        <Badge variant="secondary">Скоро</Badge>
      </div>
      <>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-red-50 p-4 text-center opacity-70">
            <p className="text-lg font-semibold text-red-700">0</p>
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
      </>
    </>
  )
}
