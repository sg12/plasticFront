/**
 * @fileoverview Список врачей в каталоге
 *
 * Отображает сетку карточек врачей с поддержкой пагинации.
 *
 * @module features/catalog/ui/DoctorList
 */

import { UserCard } from "@/widgets/userCard/ui/UserCard"
import type { CatalogDoctor } from "../../../entities/catalog/types/types"
import { Skeleton } from "@/shared/ui/skeleton"

interface DoctorListProps {
  doctors: CatalogDoctor[]
  isLoading?: boolean
  error?: string | null
}

export const DoctorList = ({ doctors, isLoading, error }: DoctorListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Ошибка: {error}</p>
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Врачи не найдены</p>
        <p className="text-muted-foreground mt-2 text-sm">Попробуйте изменить параметры поиска</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <UserCard key={doctor.id} user={doctor} />
      ))}
    </div>
  )
}
