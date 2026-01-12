/**
 * @fileoverview Хук для приглашения врача в клинику
 */

import { useState } from "react"
import { inviteDoctorToClinic } from "@/entities/user/api/invitations"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

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
  const [isInviting, setIsInviting] = useState(false)

  const inviteDoctor = async (doctorId: string): Promise<boolean> => {
    if (!clinicId) {
      toast.error("ID клиники не указан")
      return false
    }

    if (!doctorId.trim()) {
      toast.error("Введите ID врача")
      return false
    }

    setIsInviting(true)

    try {
      await inviteDoctorToClinic(clinicId, doctorId.trim())
      toast.success("Приглашение отправлено врачу")
      onSuccess?.()
      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Не удалось отправить приглашение"
      toast.error(errorMessage)
      logger.error(
        "Ошибка приглашения врача",
        error instanceof Error ? error : new Error(String(error)),
        { clinicId, doctorId },
      )
      return false
    } finally {
      setIsInviting(false)
    }
  }

  return {
    inviteDoctor,
    isInviting,
  }
}
