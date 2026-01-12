/**
 * @fileoverview Хук для принятия приглашения в клинику
 */

import { useState } from "react"
import { acceptInvitation } from "@/entities/user/api/invitations"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

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
  const [isAccepting, setIsAccepting] = useState(false)

  const acceptInvitationById = async (membershipId: string): Promise<boolean> => {
    if (!doctorId) {
      toast.error("ID врача не указан")
      return false
    }

    setIsAccepting(true)

    try {
      await acceptInvitation(doctorId, membershipId)
      toast.success("Приглашение принято")
      onSuccess?.()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось принять приглашение"
      toast.error(errorMessage)
      logger.error(
        "Ошибка принятия приглашения",
        error instanceof Error ? error : new Error(String(error)),
        { doctorId, membershipId },
      )
      return false
    } finally {
      setIsAccepting(false)
    }
  }

  return {
    acceptInvitationById,
    isAccepting,
  }
}
