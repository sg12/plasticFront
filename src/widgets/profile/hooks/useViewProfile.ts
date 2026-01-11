import { useEffect, useState } from "react"
import { getUserById } from "@/entities/user/api/api"
import type { RoleProfile } from "@/entities/user/types/types"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

/**
 * Хук для загрузки и отображения чужого профиля по userId
 */
export const useViewProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<RoleProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setIsLoading(false)
        setError("ID пользователя не указан")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const loadedProfile = await getUserById(userId)
        if (!loadedProfile) {
          setError("Профиль не найден")
          toast.error("Профиль не найден")
        } else {
          setProfile(loadedProfile)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить профиль"
        logger.error("Ошибка загрузки профиля пользователя", err as Error, { userId })
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  return {
    profile,
    isLoading,
    error,
  }
}
