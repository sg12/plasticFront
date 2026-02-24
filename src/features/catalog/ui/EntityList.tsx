/**
 * @fileoverview Обобщенный компонент для отображения списка сущностей каталога
 *
 * Поддерживает отображение списков врачей и клиник с единой логикой:
 * - Состояние загрузки (скелетоны)
 * - Обработка ошибок
 * - Пустое состояние
 * - Сетка карточек
 *
 * @module features/catalog/ui/EntityList
 */

import type { CatalogClinic, CatalogDoctor } from "@/entities/catalog/types/catalog.types"
import { Skeleton } from "@/shared/ui/skeleton"
import { UserCard } from "@/widgets/userCard/ui/UserCard"
import { Search, AlertCircle, RefreshCw, SearchX } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { useSidebar } from "@/shared/ui/sidebar"
import { useIsMobile } from "@/shared/hooks/useMobile"

interface EntityListProps<T> {
  entities: T[]
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

/**
 * Обобщенный компонент для отображения списка сущностей каталога
 *
 * @template T - Тип сущности (CatalogDoctor | CatalogClinic)
 *
 * @param props - Пропсы компонента
 * @returns JSX элемент со списком или состоянием загрузки/ошибки
 *
 * @example
 *escript
 * <EntityList
 *   entities={doctors}
 *   isLoading={isLoading}
 *   error={error}
 *   emptyMessage="Врачи не найдены"
 *   emptySubMessage="Попробуйте изменить параметры поиска"
 * />
 *
 */

export const EntityList = <T extends CatalogDoctor | CatalogClinic>({
  entities,
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

  const adaptiveGridClassName =
    gridClassName ||
    (isMobile
      ? "grid grid-cols-1 gap-6"
      : isNavigationSidebarOpen
        ? "grid grid-cols-1 gap-6 lg:grid-cols-2"
        : "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3")

  if (isLoading) {
    return (
      <div className={adaptiveGridClassName}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    const isNetworkError =
      error.toLowerCase().includes("network") || error.toLowerCase().includes("fetch")
    const isTimeoutError = error.toLowerCase().includes("timeout")
    const isServerError =
      error.toLowerCase().includes("500") || error.toLowerCase().includes("server")

    let errorTitle = "Произошла ошибка"
    let errorDescription = error
    let errorSuggestion = "Попробуйте обновить страницу или повторить попытку позже."

    if (isNetworkError) {
      errorTitle = "Проблема с подключением"
      errorDescription = "Не удалось подключиться к серверу. Проверьте ваше интернет-соединение."
      errorSuggestion = "Убедитесь, что у вас есть доступ в интернет, и попробуйте снова."
    } else if (isTimeoutError) {
      errorTitle = "Превышено время ожидания"
      errorDescription = "Запрос выполняется слишком долго."
      errorSuggestion = "Попробуйте повторить попытку через несколько секунд."
    } else if (isServerError) {
      errorTitle = "Ошибка сервера"
      errorDescription = "На сервере произошла ошибка. Мы уже работаем над её устранением."
      errorSuggestion = "Попробуйте обновить страницу через несколько минут."
    }

    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
          </div>
          <h3 className="text-destructive mb-2 text-lg font-semibold">{errorTitle}</h3>
          <p className="text-muted-foreground mb-1 text-sm">{errorDescription}</p>
          <p className="text-muted-foreground mb-4 text-xs">{errorSuggestion}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="secondary" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Попробовать снова
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-muted rounded-full p-4">
              {hasSearchQuery ? (
                <SearchX className="text-muted-foreground h-8 w-8" />
              ) : (
                <Search className="text-muted-foreground h-8 w-8" />
              )}
            </div>
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">{emptyMessage}</h3>
          <p className="text-muted-foreground mb-4 text-sm">{descriptionMessage}</p>
          {hasSearchQuery && onClearSearch && (
            <Button onClick={onClearSearch} variant="secondary" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Очистить поиск
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={adaptiveGridClassName}>
      {entities.map((entity) => (
        <UserCard key={entity.id} user={entity} />
      ))}
    </div>
  )
}
