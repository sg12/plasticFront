import { useCallback } from "react"
import { toast } from "sonner"
import useSWR from "swr"
import { useAuthStore } from "@/entities/auth/model/store"
import { type Consent, type ConsentType } from "@/entities/consent/types/consent.types"
import { updateUserConsent, getUserConsents } from "@/entities/consent/api/consent.api"
import { logger } from "@/shared/lib/logger"

export const useConsentManagement = () => {
  const { user } = useAuthStore()

  const { data, isLoading, error, mutate } = useSWR<Consent[]>(
    ["consents", user?.id],
    async () => {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }
      return getUserConsents(user.id)
    },
    {
      onError: (error) => {
        logger.error("Ошибка загрузки согласий", error as Error, {
          userId: user?.id,
        })
      },
    },
  )

  const updateConsent = useCallback(
    async (consentType: ConsentType, isActive: boolean) => {
      const consent = data?.find((c) => c.type === consentType)
      if (!consent) return

      if (consent.isRequired && !isActive) {
        toast.error("Это согласие обязательно для использования сервиса")
        return
      }

      try {
        if (!user?.id) {
          throw new Error("User not authenticated")
        }

        // Выполняем запрос через Supabase
        await updateUserConsent(user.id, consentType, isActive)

        // После успешного запроса обновляем кэш SWR
        // Сначала обновляем локально (оптимистичное обновление)
        const updatedConsents = data?.map((c) =>
          c.type === consentType
            ? {
                ...c,
                isActive,
                grantedAt: isActive ? new Date().toISOString() : c.grantedAt,
                revokedAt: !isActive ? new Date().toISOString() : c.revokedAt,
              }
            : c,
        )

        // Обновляем кэш с новыми данными
        // SWR автоматически предотвратит ре-рендер, если данные не изменились
        await mutate(updatedConsents, { revalidate: false })

        toast.success(isActive ? "Согласие предоставлено" : "Согласие отозвано")
      } catch (error) {
        logger.error(
          "Ошибка обновления согласия",
          error instanceof Error ? error : new Error(String(error)),
          {
            userId: user?.id,
            consentType,
            isActive,
          },
        )
        toast.error("Не удалось сохранить изменение")

        // При ошибке перезагружаем данные из сервера
        await mutate()
      }
    },
    [user?.id, mutate],
  )

  const revokeConsent = useCallback(
    (consentType: ConsentType) => updateConsent(consentType, false),
    [updateConsent],
  )

  const grantConsent = useCallback(
    (consentType: ConsentType) => updateConsent(consentType, true),
    [updateConsent],
  )

  return {
    data,
    isLoading: isLoading && !error,
    error: error?.message ?? null,
    updateConsent,
    revokeConsent,
    grantConsent,
    refresh: mutate,
  }
}
