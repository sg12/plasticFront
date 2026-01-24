/**
 * @fileoverview Универсальный компонент для отображения списков членства (врачи/клиники)
 *
 * Используется для:
 * - Списка врачей клиники (ClinicDoctorsList)
 * - Списка клиник врача (DoctorClinicsList)
 *
 * @module shared/ui/MembershipList
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { EmptyState } from "@/shared/ui/emptyState"
import { ErrorState } from "@/shared/ui/errorState"
import { Skeleton } from "@/shared/ui/skeleton"
import type { LucideIcon } from "lucide-react"

interface MembershipListProps<TMembership> {
  /** Список членств */
  memberships: TMembership[]
  /** Состояние загрузки */
  isLoading: boolean
  /** Ошибка загрузки */
  error: string | null
  /** Заголовок карточки */
  title: string
  /** Иконка заголовка */
  titleIcon: LucideIcon
  /** Цвет иконки заголовка */
  titleIconColor?: string
  /** Дополнительные действия в заголовке (например, кнопка добавления) */
  headerActions?: React.ReactNode
  /** Функция рендеринга карточки члена */
  renderCard?: (membership: TMembership) => React.ReactNode
  /** Кастомный рендер контента (если нужна группировка или другая структура) */
  renderContent?: () => React.ReactNode
  /** Конфигурация пустого состояния */
  emptyState: {
    icon: LucideIcon
    title: string
    description?: string
  }
  /** Обработчик повторной попытки при ошибке */
  onRetry?: () => void
  /** Количество скелетонов при загрузке */
  skeletonCount?: number
  /** Дополнительный контент перед списком (например, принятые клиники) */
  beforeList?: React.ReactNode
}

export const MembershipList = <TMembership,>({
  memberships,
  isLoading,
  error,
  title,
  titleIcon: TitleIcon,
  titleIconColor = "text-purple-600",
  headerActions,
  renderCard,
  renderContent,
  emptyState,
  onRetry,
  skeletonCount = 3,
  beforeList,
}: MembershipListProps<TMembership>) => {
  return (
    <>
      {beforeList}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TitleIcon className={`h-5 w-5 ${titleIconColor}`} />
              {title}
            </CardTitle>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              error={error}
              title={`Не удалось загрузить ${title.toLowerCase()}`}
              onRetry={onRetry}
            />
          ) : memberships.length === 0 ? (
            <EmptyState
              icon={emptyState.icon}
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : renderContent ? (
            renderContent()
          ) : renderCard ? (
            <div className="space-y-4">
              {memberships.map((membership) => renderCard(membership))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  )
}
