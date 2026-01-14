/**
 * @fileoverview Хук для получения списка врачей клиники
 */

import { getClinicDoctors } from "@/entities/user/api/invitations"
import type { ClinicMembership } from "@/entities/user/types/invitations"
import { useEntityList } from "@/shared/hooks/useEntityList"

interface UseClinicDoctorsReturn {
  doctors: ClinicMembership[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Хук для получения и управления списком врачей клиники
 *
 * @param clinicId - ID клиники
 * @returns Объект с данными врачей, состоянием загрузки и функцией обновления
 */
export const useClinicDoctors = (clinicId: string | undefined): UseClinicDoctorsReturn => {
  const { data, isLoading, error, refresh } = useEntityList<ClinicMembership, string>({
    fetchFn: getClinicDoctors,
    id: clinicId,
    errorMessage: "Не удалось загрузить список врачей",
    entityName: "врачи клиники",
    logContext: (id) => ({ clinicId: id }),
  })

  return {
    doctors: data,
    isLoading,
    error,
    refresh,
  }
}
