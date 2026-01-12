/**
 * @fileoverview Хук для получения списка врачей клиники
 */

import { useEffect, useState } from "react"
import { getClinicDoctors } from "@/entities/user/api/invitations"
import type { ClinicMembership } from "@/entities/user/types/invitations"
import { logger } from "@/shared/lib/logger"

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
  const [doctors, setDoctors] = useState<ClinicMembership[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctors = async () => {
    if (!clinicId) {
      setDoctors([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getClinicDoctors(clinicId)
      setDoctors(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить список врачей"
      setError(errorMessage)
      logger.error("Ошибка загрузки врачей клиники", err instanceof Error ? err : new Error(String(err)), {
        clinicId,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicId])

  return {
    doctors,
    isLoading,
    error,
    refresh: fetchDoctors,
  }
}
