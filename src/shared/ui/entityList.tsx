import type { ReactNode } from "react"
import { Skeleton } from "@/shared/ui/skeleton"
import { Search, AlertCircle, RefreshCw, SearchX } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useSidebar } from "@/shared/ui/sidebar"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { cn } from "@/shared/lib/utils"

interface EntityListProps<T extends { id: string | number }> {
  entities: T[]
  renderItem: (entity: T) => ReactNode
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
  descriptionMessage?: string
  skeletonCount?: number
  gridClassName?: string
  onRetry?: () => void
  onClearSearch?: () => void
  hasSearchQuery?: boolean
}

export const EntityList = <T extends { id: string | number }>({
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
    "grid gap-6",
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
          <Skeleton key={`skeleton-${index}`} className="h-[200px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    const isNetworkError = /network|fetch/i.test(error)
    const isTimeoutError = /timeout/i.test(error)
    const isServerError = /500|server/i.test(error)

    const errorContent = {
      title: isNetworkError ? "Проблема с подключением" : isTimeoutError ? "Время ожидания истекло" : "Ошибка",
      desc: isNetworkError ? "Проверьте интернет-соединение." : error,
      action: onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" className="mt-4 gap-2">
          <RefreshCw className="h-4 w-4" /> Попробовать снова
        </Button>
      )
    }

    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-destructive/10 mb-4 rounded-full p-4">
          <AlertCircle className="text-destructive h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">{errorContent.title}</h3>
        <p className="text-muted-foreground text-sm">{errorContent.desc}</p>
        {errorContent.action}
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          {hasSearchQuery ? <SearchX className="h-8 w-8" /> : <Search className="h-8 w-8" />}
        </div>
        <h3 className="text-lg font-semibold">{emptyMessage}</h3>
        <p className="text-muted-foreground mb-6 text-sm">{descriptionMessage}</p>
        {hasSearchQuery && onClearSearch && (
          <Button onClick={onClearSearch} variant="secondary" size="sm">
            Очистить поиск
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={adaptiveGridClassName}>
      {entities.map((entity) => (
        <div key={entity.id}>
          {renderItem(entity)}
        </div>
      ))}
    </div>
  )
}