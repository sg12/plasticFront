/**
 * @fileoverview Хук для удаления врача из клиники
 */

import { removeDoctorFromClinic } from "@/entities/user/api/invitations"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

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
  const { execute, isLoading: isRemoving } = useAsyncAction<
    string,
    Awaited<ReturnType<typeof removeDoctorFromClinic>>
  >({
    action: async (doctorId: string) => {
      if (!clinicId) {
        throw new Error("ID клиники не указан")
      }
      return removeDoctorFromClinic(clinicId, doctorId)
    },
    successMessage: "Врач удален из клиники",
    errorMessage: "Не удалось удалить врача",
    onSuccess: () => {
      onSuccess?.()
    },
    logContext: (doctorId) => ({ clinicId, doctorId }),
    logActionName: "удаление врача",
  })

  const removeDoctor = async (doctorId: string): Promise<boolean> => {
    const result = await execute(doctorId)
    return result !== null
  }

  return {
    removeDoctor,
    isRemoving,
  }
}
