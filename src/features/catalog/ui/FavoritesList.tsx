/**
 * @fileoverview Компонент списка избранных врачей и клиник
 *
 * Отображает объединенный список избранных врачей и клиник.
 * Фильтрует переданные данные по ID избранного из store.
 *
 * @module features/catalog/ui/FavoritesList
 */

import type { CatalogClinic, CatalogDoctor } from "@/entities/catalog/types/types"
import { Skeleton } from "@/shared/ui/skeleton"
import { useCatalogStore } from "@/entities/catalog/model/store"
import { UserCard } from "@/features/catalog/ui/UserCard"

interface FavoritesListProps {
  doctors: CatalogDoctor[]
  clinics: CatalogClinic[]
  isLoading?: boolean
  error?: string | null
}

export const FavoritesList = ({ doctors, clinics, isLoading, error }: FavoritesListProps) => {
  const { favoriteDoctors, favoriteClinics } = useCatalogStore()

  // Фильтруем только те элементы, которые есть в избранном
  const favoriteDoctorsList = doctors.filter((doctor) => favoriteDoctors.includes(doctor.id))
  const favoriteClinicsList = clinics.filter((clinic) => favoriteClinics.includes(clinic.id))

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

  if (favoriteDoctorsList.length + favoriteClinicsList.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Избранные не найдены</p>
        <p className="text-muted-foreground mt-2 text-sm">Добавьте врача или клинику в избранные</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {favoriteDoctorsList.map((doctor) => (
        <UserCard key={doctor.id} user={doctor} />
      ))}
      {favoriteClinicsList.map((clinic) => (
        <UserCard key={clinic.id} user={clinic} />
      ))}
    </div>
  )
}
