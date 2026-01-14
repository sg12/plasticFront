import useSWR from "swr"
import { useAuthStore } from "@/entities/auth/model/store"
import { getLoginHistory } from "@/features/loginHistory/api/api"
import { logger } from "@/shared/lib/logger"
export type { LoginRecord } from "@/features/loginHistory/types/types"

export const useLoginHistory = () => {
  const { user } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR(
    user?.id ? ["loginHistory", user.id] : null,
    () => {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }
      return getLoginHistory(user.id)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2 * 60 * 1000,
      onError: (err) => {
        if (err instanceof Error && err.message.includes("миграцию")) {
          logger.warn("Таблица loginHistory не создана. Запустите миграцию.", {
            userId: user?.id,
          })
        } else {
          logger.error("Ошибка загрузки истории входов", err as Error, {
            userId: user?.id,
          })
        }
      },
    },
  )

  return {
    history: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  }
}
