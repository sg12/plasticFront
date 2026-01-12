/**
 * @fileoverview Хук для получения списка клиник врача
 */

import { useEffect, useState } from "react"
import { getDoctorInvitations } from "@/entities/user/api/invitations"
import type { ClinicMembership } from "@/entities/user/types/invitations"
import { logger } from "@/shared/lib/logger"

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
  const [clinics, setClinics] = useState<ClinicMembership[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClinics = async () => {
    if (!doctorId) {
      setClinics([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getDoctorInvitations(doctorId)
      setClinics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить клиники"
      setError(errorMessage)
      logger.error(
        "Ошибка загрузки клиник врача",
        err instanceof Error ? err : new Error(String(err)),
        {
          doctorId,
        },
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClinics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId])

  return {
    clinics,
    isLoading,
    error,
    refresh: fetchClinics,
  }
}
