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

import type { CatalogClinic, CatalogDoctor } from "@/entities/catalog/types/types"
import { Skeleton } from "@/shared/ui/skeleton"
import { UserCard } from "@/widgets/userCard/ui/UserCard"

interface EntityListProps<T> {
  entities: T[]
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
  descriptionMessage?: string
  skeletonCount?: number
  gridClassName?: string
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
  gridClassName = "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
}: EntityListProps<T>) => {
  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">Произошла ошибка</p>
          <p className="text-muted-foreground mt-2 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
        <div className="text-center">
          <p className="text-foreground text-lg font-semibold">{emptyMessage}</p>
          <p className="text-muted-foreground mt-2 text-sm">{descriptionMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={gridClassName}>
      {entities.map((entity) => (
        <UserCard key={entity.id} user={entity} />
      ))}
    </div>
  )
}
