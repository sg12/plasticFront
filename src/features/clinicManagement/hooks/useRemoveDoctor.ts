/**
 * @fileoverview Хук для удаления врача из клиники
 */

import { useState } from "react"
import { removeDoctorFromClinic } from "@/entities/user/api/invitations"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

interface UseRemoveDoctorReturn {
  removeDoctor: (doctorId: string) => Promise<boolean>
  isRemoving: boolean
}

/**
 * Хук для удаления врача из клиники
 *
 * @param clinicId - ID клиники
 * @param onSuccess - Callback при успешном удалении
 * @returns Функция удаления и состояние загрузки
 */
export const useRemoveDoctor = (
  clinicId: string | undefined,
  onSuccess?: () => void,
): UseRemoveDoctorReturn => {
  const [isRemoving, setIsRemoving] = useState(false)

  const removeDoctor = async (doctorId: string): Promise<boolean> => {
    if (!clinicId) {
      toast.error("ID клиники не указан")
      return false
    }

    setIsRemoving(true)

    try {
      await removeDoctorFromClinic(clinicId, doctorId)
      toast.success("Врач удален из клиники")
      onSuccess?.()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось удалить врача"
      toast.error(errorMessage)
      logger.error(
        "Ошибка удаления врача",
        error instanceof Error ? error : new Error(String(error)),
        { clinicId, doctorId },
      )
      return false
    } finally {
      setIsRemoving(false)
    }
  }

  return {
    removeDoctor,
    isRemoving,
  }
}
