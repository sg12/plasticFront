import useSWR from "swr"
import { useAuthStore } from "@/entities/auth/model/store"
import { fetchLoginHistory } from "@/features/loginHistory/api/api"
export type { LoginRecord } from "@/features/loginHistory/types/types"

export const useLoginHistory = () => {
  const { user } = useAuthStore()

  const { data, error, isLoading, mutate } = useSWR(
    user?.id ? ["loginHistory", user.id] : null,
    () => {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }
      return fetchLoginHistory(user.id)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2 * 60 * 1000,
      onError: (err) => {
        if (err instanceof Error && err.message.includes("миграцию")) {
          console.warn("Ошибка: таблица loginHistory не создана. Запустите миграцию.")
        } else {
          console.error("Ошибка загрузки истории входов:", err)
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
