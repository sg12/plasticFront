/**
 * @fileoverview Компонент списка избранных врачей и клиник
 *
 * Отображает объединенный список избранных врачей и клиник.
 * Фильтрует переданные данные по ID избранного из store.
 *
 * @module features/catalog/ui/FavoritesList
 */

import type { CatalogClinic, CatalogDoctor } from "@/entities/catalog/types/types"
import { useCatalogStore } from "@/entities/catalog/model/store"
import { EntityList } from "./EntityList"

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

  const totalFavorites = favoriteDoctorsList.length + favoriteClinicsList.length

  if (totalFavorites === 0 && !isLoading) {
    return (
      <EntityList
        entities={[]}
        isLoading={isLoading}
        error={error}
        emptyMessage="У вас пока нет избранных"
        descriptionMessage="Добавьте врачей или клиники в избранное, чтобы быстро находить их здесь"
      />
    )
  }

  return (
    <div className="space-y-6">
      {favoriteDoctorsList.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold">Врачи</h3>
            <span className="text-muted-foreground text-sm">({favoriteDoctorsList.length})</span>
          </div>
          <EntityList
            entities={favoriteDoctorsList}
            isLoading={isLoading}
            error={error}
            emptyMessage="Врачи не найдены"
          />
        </div>
      )}

      {favoriteClinicsList.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold">Клиники</h3>
            <span className="text-muted-foreground text-sm">({favoriteClinicsList.length})</span>
          </div>
          <EntityList
            entities={favoriteClinicsList}
            isLoading={isLoading}
            error={error}
            emptyMessage="Клиники не найдены"
          />
        </div>
      )}
    </div>
  )
}
