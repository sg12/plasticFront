/**
 * @fileoverview Список клиник в каталоге
 */

import type { CatalogClinic } from "../../../entities/catalog/types/types"
import { Skeleton } from "@/shared/ui/skeleton"
import { UserCard } from "@/widgets/userCard/ui/UserCard"

interface ClinicListProps {
  clinics: CatalogClinic[]
  isLoading?: boolean
  error?: string | null
}

export const ClinicList = ({ clinics, isLoading, error }: ClinicListProps) => {
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

  if (clinics.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Клиники не найдены</p>
        <p className="text-muted-foreground mt-2 text-sm">Попробуйте изменить параметры поиска</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clinics.map((clinic) => (
        <UserCard key={clinic.id} user={clinic} />
      ))}
    </div>
  )
}
