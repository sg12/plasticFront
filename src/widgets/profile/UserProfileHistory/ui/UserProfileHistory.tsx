import { pluralRu } from '../../../../shared/lib/utils'
import type { Props } from "../../types/types"
import dayjs from "dayjs"

export const UserProfileHistory = ({ profile }: Props) => {
  const formatWithUs = () => {
    if (!profile?.created_at) return "—"

    const created = dayjs(profile.created_at)
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
    if (years > 0) parts.push(`${years} ${pluralRu(years, "год", "года", "лет")}`)
    if (months > 0 && parts.length < 2) {
      parts.push(`${months} ${pluralRu(months, "месяц", "месяца", "месяцев")}`)
    }
    if (days > 0 && parts.length < 2) {
      parts.push(`${days} ${pluralRu(days, "день", "дня", "дней")}`)
    }

    return parts.length ? parts.join(" ") : "сегодня"
  }

  const withUsLabel = formatWithUs()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4">Медицинская история</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-purple-50 p-4 text-center blur-xs">
          <p className="text-purple-600">0</p>
          <p className="mt-1 text-gray-600">Процедур</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center blur-xs">
          <p className="text-blue-600">0</p>
          <p className="mt-1 text-gray-600">Клиник</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center blur-xs">
          <p className="text-green-600">0</p>
          <p className="mt-1 text-gray-600">Врачей</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <p className="text-orange-600">{withUsLabel}</p>
          <p className="mt-1 text-gray-600">С нами</p>
        </div>
      </div>
    </div>
  )
}
