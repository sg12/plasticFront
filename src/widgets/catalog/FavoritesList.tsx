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
import { UserCard } from "./UserCard"
import { USER_ROLE } from "@/entities/user/model/user.constants"

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
    const favorites = user?.patient?.favorites || []

    const favoriteDoctorIds = new Set(favorites.map(f => f.doctorId).filter(Boolean))
    const favoriteClinicIds = new Set(favorites.map(f => f.clinicId).filter(Boolean))

    const d = doctors.filter((doc) => favoriteDoctorIds.has(doc.user.id))
    const c = clinics.filter((cli) => favoriteClinicIds.has(cli.user.id))

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
    <div className="grid space-global">
      
      {(filteredDoctors.length > 0 || isLoading) && (
        <EntityList
          entities={filteredDoctors}
          isLoading={isLoading}
          error={error}
          emptyMessage="Врачи не найдены"
          renderItem={(doctor) => <UserCard user={doctor} role={USER_ROLE.DOCTOR} />}
        />
      )}
      {(filteredClinics.length > 0 || isLoading) && (
        <EntityList
          entities={filteredClinics}
          isLoading={isLoading}
          error={error}
          emptyMessage="Клиники не найдены"
          renderItem={(clinic) => <UserCard user={clinic} role={USER_ROLE.CLINIC} />}
        />
      )}

    </div>
  )
}