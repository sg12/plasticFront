/**
 * @fileoverview Хук для приглашения врача в клинику
 */

import { inviteDoctorToClinic } from "@/entities/user/api/invitations"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

interface UseInviteDoctorReturn {
  inviteDoctor: (doctorId: string) => Promise<boolean>
  isInviting: boolean
}

/**
 * Хук для приглашения врача в клинику
 *
 * @param clinicId - ID клиники
 * @param onSuccess - Callback при успешном приглашении
 * @returns Функция приглашения и состояние загрузки
 */
export const useInviteDoctor = (
  clinicId: string | undefined,
  onSuccess?: () => void,
): UseInviteDoctorReturn => {
  const { execute, isLoading: isInviting } = useAsyncAction<
    string,
    Awaited<ReturnType<typeof inviteDoctorToClinic>>
  >({
    action: async (doctorId: string) => {
      if (!clinicId) {
        throw new Error("ID клиники не указан")
      }
      if (!doctorId.trim()) {
        throw new Error("Введите ID врача")
      }
      return inviteDoctorToClinic(clinicId, doctorId.trim())
    },
    successMessage: "Приглашение отправлено врачу",
    errorMessage: "Не удалось отправить приглашение",
    onSuccess: () => {
      onSuccess?.()
    },
    logContext: (doctorId) => ({ clinicId, doctorId }),
    logActionName: "приглашение врача",
  })

  const inviteDoctor = async (doctorId: string): Promise<boolean> => {
    const result = await execute(doctorId)
    return result !== null
  }

  return {
    inviteDoctor,
    isInviting,
  }
}
