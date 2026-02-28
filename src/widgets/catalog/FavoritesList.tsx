/**
 * @fileoverview Компонент списка избранных врачей и клиник
 * @module features/catalog/ui/FavoritesList
 */

import { useMemo } from "react"
import { EntityList } from "@/shared/ui/entityList"
import type { Clinic, Doctor } from "@/entities/user/types/user.types"
import { useMe } from "@/entities/user/api/user.queries"
import { EmptyState } from "@/shared/ui/emptyState"
import { HeartCrack } from "lucide-react"

// import { DoctorCard } from "@/entities/doctor/ui/DoctorCard"
// import { ClinicCard } from "@/entities/clinic/ui/ClinicCard"

interface FavoritesListProps {
  doctors: Doctor[]
  clinics: Clinic[]
  isLoading?: boolean
  error?: Error | null
}

export const FavoritesList = ({ doctors, clinics, isLoading, error }: FavoritesListProps) => {
  const { data: user } = useMe()

  const { filteredDoctors, filteredClinics, isEmpty } = useMemo(() => {
    const favoriteIds = user?.patient?.favorites || []

    const d = doctors.filter((doc) => favoriteIds.includes(doc.user.id))
    const c = clinics.filter((cli) => favoriteIds.includes(cli.user.id))

    return {
      filteredDoctors: d,
      filteredClinics: c,
      isEmpty: d.length === 0 && c.length === 0,
    }
  }, [doctors, clinics, user?.patient?.favorites])

  if (isEmpty && !isLoading) {
    return (
      <EmptyState
        icon={HeartCrack}
        title="Список избранного пуст"
        description="Добавьте врачей или клиники в избранное, чтобы они появились здесь"
      />
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {(filteredDoctors.length > 0 || isLoading) && (
        <section>
          <div className="mb-6 flex items-end gap-2 px-1">
            <h3 className="text-2xl font-bold tracking-tight">Избранные врачи</h3>
            {!isLoading && (
              <span className="text-muted-foreground font-medium mb-1">
                {filteredDoctors.length}
              </span>
            )}
          </div>
          <EntityList
            entities={filteredDoctors}
            isLoading={isLoading}
            error={error}
            emptyMessage="Врачи не найдены"
            // Передайте сюда реальный компонент карточки
            renderItem={(doc) => (
              <div className="p-4 border rounded-xl">Карточка врача: {doc.user.id}</div>
            )}
          />
        </section>
      )}

      {filteredDoctors.length > 0 && filteredClinics.length > 0 && (
        <hr className="border-border/50 shadow-sm" />
      )}

      {(filteredClinics.length > 0 || isLoading) && (
        <section>
          <div className="mb-6 flex items-end gap-2 px-1">
            <h3 className="text-2xl font-bold tracking-tight">Избранные клиники</h3>
            {!isLoading && (
              <span className="text-muted-foreground font-medium mb-1">
                {filteredClinics.length}
              </span>
            )}
          </div>
          <EntityList
            entities={filteredClinics}
            isLoading={isLoading}
            error={error}
            emptyMessage="Клиники не найдены"
            renderItem={(cli) => (
              <div className="p-4 border rounded-xl">Карточка клиники: {cli.user.id}</div>
            )}
          />
        </section>
      )}
    </div>
  )
}