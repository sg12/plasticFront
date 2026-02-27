/**
 * @fileoverview Хук для получения списка клиник врача
 */

import { getDoctorInvitations } from "@/entities/user/api/invitations"
import type { ClinicMembership } from "@/entities/user/types/invitations"
import { useEntityList } from "@/shared/hooks/useEntityList"

interface UseDoctorClinicsReturn {
  clinics: ClinicMembership[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Хук для получения и управления списком клиник врача
 *
 * @param doctorId - ID врача
 * @returns Объект с данными клиник, состоянием загрузки и функцией обновления
 */
export const useDoctorClinics = (doctorId: string | undefined): UseDoctorClinicsReturn => {
  const { data, isLoading, error, refresh } = useEntityList<ClinicMembership, string>({
    fetchFn: getDoctorInvitations,
    id: doctorId,
    errorMessage: "Не удалось загрузить клиники",
    entityName: "клиники врача",
    logContext: (id) => ({ doctorId: id }),
  })

  return {
    clinics: data,
    isLoading,
    error,
    refresh,
  }
}
