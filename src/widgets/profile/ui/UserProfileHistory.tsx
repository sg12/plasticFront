import type { RoleProfile } from "@/entities/user/types/user.types"
import { pluralRu } from "@/shared/lib/utils"
import { CardTitle } from "@/shared/ui/card"
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <p className="text-lg font-semibold text-orange-700">{withUsLabel}</p>
            <p className="text-muted-foreground mt-1 text-xs">С нами</p>
          </div>
          {Array.from({ length: 5 })
            .map((_, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-4 text-center" />
            ))}
        </div>
      </>
    </>
  )
}
