import useSWR, { useSWRConfig } from "swr"
import { toast } from "sonner"
import { supabase } from "@/shared/api/supabase/client"
import { useAuthStore } from "@/entities/auth/model/store"
import { CONSENT_TYPES, type Consent, type ConsentType } from "../types/types"

const CONSENTS_KEY = "user_consents"

const fetchConsents = async (userId?: string): Promise<Consent[]> => {
  if (userId) {
    const { data, error } = await supabase.from("user_consents").select("*").eq("user_id", userId)

    if (!error && data && data.length > 0) {
      return data.map(mapDbConsent)
    }
  }

  const saved = localStorage.getItem(CONSENTS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }

  return createDefaultConsents()
}

const updateConsentMutation = async ({
  userId,
  consentType,
  isActive,
}: {
  userId?: string
  consentType: ConsentType
  isActive: boolean
}) => {
  const now = new Date().toISOString()

  const saved = localStorage.getItem(CONSENTS_KEY)
  if (saved) {
    const consents: Consent[] = JSON.parse(saved)
    const updatedConsents = consents.map((c) =>
      c.type === consentType
        ? {
            ...c,
            isActive,
            grantedAt: isActive ? now : c.grantedAt,
            revokedAt: !isActive ? now : null,
          }
        : c,
    )
    localStorage.setItem(CONSENTS_KEY, JSON.stringify(updatedConsents))
  }

  if (userId) {
    const { error } = await supabase
      .from("user_consents")
      .update({
        is_active: isActive,
        granted_at: isActive ? now : null,
        revoked_at: !isActive ? now : null,
      })
      .eq("user_id", userId)
      .eq("consent_type", consentType)

    if (error) throw error
  }
}

export const useConsentManagement = () => {
  const { user } = useAuthStore()
  const { mutate: globalMutate } = useSWRConfig()

  const { data, isLoading, mutate } = useSWR(
    ["consents", user?.id],
    () => fetchConsents(user?.id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000, // 5 минут
    },
  )

  const updateConsent = async (consentType: ConsentType, isActive: boolean) => {
    const consent = data?.find((c) => c.type === consentType)
    if (!consent) return

    if (consent.isRequired && !isActive) {
      toast.error("Это согласие обязательно для использования сервиса")
      return
    }

    try {
      await updateConsentMutation({
        userId: user?.id,
        consentType,
        isActive,
      })

      // Обновляем кеш
      await mutate()
      await globalMutate(["consents", user?.id])

      toast.success(isActive ? "Согласие предоставлено" : "Согласие отозвано")
    } catch (error) {
      // Обновляем кеш даже при ошибке
      await mutate()
      await globalMutate(["consents", user?.id])
      toast.error("Не удалось сохранить изменение")
    }
  }

  const revokeConsent = (consentType: ConsentType) => updateConsent(consentType, false)
  const grantConsent = (consentType: ConsentType) => updateConsent(consentType, true)

  return {
    consents: data ?? [],
    isLoading,
    updateConsent,
    revokeConsent,
    grantConsent,
    refresh: mutate,
  }
}

const createDefaultConsents = (): Consent[] => {
  const now = new Date().toISOString()

  return Object.entries(CONSENT_TYPES).map(([type, info]) => ({
    id: type,
    type: type as ConsentType,
    title: info.title,
    description: info.description,
    isActive: true,
    grantedAt: now,
    revokedAt: null,
    isRequired: info.isRequired,
  }))
}

const mapDbConsent = (dbConsent: any): Consent => {
  const type = dbConsent.consent_type as ConsentType
  const info = CONSENT_TYPES[type]

  return {
    id: dbConsent.id || type,
    type,
    title: info?.title || type,
    description: info?.description || "",
    isActive: dbConsent.is_active,
    grantedAt: dbConsent.granted_at,
    revokedAt: dbConsent.revoked_at,
    isRequired: info?.isRequired || false,
  }
}
