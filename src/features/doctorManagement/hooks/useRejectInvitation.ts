/**
 * @fileoverview Хук для отклонения приглашения в клинику
 */

import { useState } from "react"
import { rejectInvitation } from "@/entities/user/api/invitations"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

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
  const [isRejecting, setIsRejecting] = useState(false)

  const rejectInvitationById = async (membershipId: string): Promise<boolean> => {
    if (!doctorId) {
      toast.error("ID врача не указан")
      return false
    }

    setIsRejecting(true)

    try {
      await rejectInvitation(doctorId, membershipId)
      toast.success("Приглашение отклонено")
      onSuccess?.()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось отклонить приглашение"
      toast.error(errorMessage)
      logger.error(
        "Ошибка отклонения приглашения",
        error instanceof Error ? error : new Error(String(error)),
        { doctorId, membershipId },
      )
      return false
    } finally {
      setIsRejecting(false)
    }
  }

  return {
    rejectInvitationById,
    isRejecting,
  }
}
