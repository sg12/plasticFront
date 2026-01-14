/**
 * @fileoverview Хук для отклонения приглашения в клинику
 */

import { rejectInvitation } from "@/entities/user/api/invitations"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

interface UseRejectInvitationReturn {
  rejectInvitationById: (membershipId: string) => Promise<boolean>
  isRejecting: boolean
}

/**
 * Хук для отклонения приглашения в клинику
 *
 * @param doctorId - ID врача
 * @param onSuccess - Callback при успешном отклонении
 * @returns Функция отклонения и состояние загрузки
 */
export const useRejectInvitation = (
  doctorId: string | undefined,
  onSuccess?: () => void,
): UseRejectInvitationReturn => {
  const { execute, isLoading: isRejecting } = useAsyncAction<
    string,
    Awaited<ReturnType<typeof rejectInvitation>>
  >({
    action: async (membershipId: string) => {
      if (!doctorId) {
        throw new Error("ID врача не указан")
      }
      return rejectInvitation(doctorId, membershipId)
    },
    successMessage: "Приглашение отклонено",
    errorMessage: "Не удалось отклонить приглашение",
    onSuccess: () => {
      onSuccess?.()
    },
    logContext: (membershipId) => ({ doctorId, membershipId }),
    logActionName: "отклонение приглашения",
  })

  const rejectInvitationById = async (membershipId: string): Promise<boolean> => {
    const result = await execute(membershipId)
    return result !== null
  }

  return {
    rejectInvitationById,
    isRejecting,
  }
}
