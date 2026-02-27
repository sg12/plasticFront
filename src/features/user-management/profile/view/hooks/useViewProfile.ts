/**
 * @fileoverview Хук для загрузки чужого профиля
 *
 * Содержит бизнес-логику загрузки профиля пользователя по ID
 *
 * @module features/profile/hooks/useViewProfile
 */

import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/entities/user/api/user.api"

/**
 * Хук для загрузки и отображения чужого профиля по userId
 */
export const useViewProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-profile", userId],

    queryFn: async () => {
      if (!userId) throw new Error("ID пользователя не указан")

      try {
        const profile = await getUserById(userId)
        if (!profile) throw new Error("Профиль не найден")
        return profile
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ошибка загрузки"
        logger.error("Ошибка загрузки профиля", err as Error, { userId })
        toast.error(errorMessage)
        throw err
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
