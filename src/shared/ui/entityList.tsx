/**
 * @fileoverview Универсальный список сущностей с поддержкой состояний
 * @module shared/ui/entityList
 */

import type { ReactNode } from "react"
import { Skeleton } from "@/shared/ui/skeleton"
import { Search, SearchX } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useSidebar } from "@/shared/ui/sidebar"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { cn } from "@/shared/lib/utils"
import { ErrorState } from "./errorState"
import { EmptyState } from "./emptyState"

interface EntityListProps<T> {
  entities: T[]
  renderItem: (entity: T) => ReactNode
  isLoading?: boolean
  error?: string | Error | null
  emptyMessage?: string
  descriptionMessage?: string
  skeletonCount?: number
  gridClassName?: string
  onRetry?: () => void
  onClearSearch?: () => void
  hasSearchQuery?: boolean
}

export const EntityList = <T,>({
  entities,
  renderItem,
  isLoading = false,
  error = null,
  emptyMessage = "Элементы не найдены",
  descriptionMessage = "Попробуйте изменить параметры поиска",
  skeletonCount = 4,
  gridClassName,
  onRetry,
  onClearSearch,
  hasSearchQuery = false,
}: EntityListProps<T>) => {
  const { open: isNavigationSidebarOpen } = useSidebar("navigation")
  const isMobile = useIsMobile()

  const adaptiveGridClassName = cn(
    "grid gap-6 transition-all duration-300",
    isMobile
      ? "grid-cols-1"
      : isNavigationSidebarOpen
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
    gridClassName
  )

  if (isLoading) {
    return (
      <div className={adaptiveGridClassName}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-[280px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center animate-in fade-in">
        <ErrorState
          error={error}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <EmptyState
        icon={hasSearchQuery ? SearchX : Search}
        title={emptyMessage}
        description={descriptionMessage}
        action={
          hasSearchQuery && onClearSearch ? (
            <Button onClick={onClearSearch} variant="secondary" size="sm">
              Очистить поиск
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <div className={adaptiveGridClassName}>
      {entities.map((entity, index) => (
        <div key={index} >
          {renderItem(entity)}
        </div>
      ))}
    </div >
  )
}