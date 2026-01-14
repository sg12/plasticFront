/**
 * @fileoverview Хук для принятия приглашения в клинику
 */

import { acceptInvitation } from "@/entities/user/api/invitations"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

interface UseAcceptInvitationReturn {
  acceptInvitationById: (membershipId: string) => Promise<boolean>
  isAccepting: boolean
}

/**
 * Хук для принятия приглашения в клинику
 *
 * @param doctorId - ID врача
 * @param onSuccess - Callback при успешном принятии
 * @returns Функция принятия и состояние загрузки
 */
export const useAcceptInvitation = (
  doctorId: string | undefined,
  onSuccess?: () => void,
): UseAcceptInvitationReturn => {
  const { execute, isLoading: isAccepting } = useAsyncAction<
    string,
    Awaited<ReturnType<typeof acceptInvitation>>
  >({
    action: async (membershipId: string) => {
      if (!doctorId) {
        throw new Error("ID врача не указан")
      }
      return acceptInvitation(doctorId, membershipId)
    },
    successMessage: "Приглашение принято",
    errorMessage: "Не удалось принять приглашение",
    onSuccess: () => {
      onSuccess?.()
    },
    logContext: (membershipId) => ({ doctorId, membershipId }),
    logActionName: "принятие приглашения",
  })

  const acceptInvitationById = async (membershipId: string): Promise<boolean> => {
    const result = await execute(membershipId)
    return result !== null
  }

  return {
    acceptInvitationById,
    isAccepting,
  }
}
