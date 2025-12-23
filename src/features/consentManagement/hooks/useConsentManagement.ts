import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/shared/api/supabase/client"
import { useAuthStore } from "@/entities/auth/model/store"
import { CONSENT_TYPES, type Consent, type ConsentType } from "../types/types"

const CONSENTS_KEY = "user_consents"

export function useConsentManagement() {
  const { user } = useAuthStore()
  const [consents, setConsents] = useState<Consent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConsents()
  }, [user?.id])

  const loadConsents = async () => {
    setIsLoading(true)

    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from("user_consents")
          .select("*")
          .eq("user_id", user.id)

        if (!error && data && data.length > 0) {
          setConsents(data.map(mapDbConsent))
          setIsLoading(false)
          return
        }
      }

      const saved = localStorage.getItem(CONSENTS_KEY)
      if (saved) {
        setConsents(JSON.parse(saved))
      } else {
        const defaultConsents = createDefaultConsents()
        setConsents(defaultConsents)
        localStorage.setItem(CONSENTS_KEY, JSON.stringify(defaultConsents))
      }
    } catch (e) {
      console.error("Ошибка загрузки согласий:", e)
      setConsents(createDefaultConsents())
    } finally {
      setIsLoading(false)
    }
  }

  const updateConsent = async (consentType: ConsentType, isActive: boolean) => {
    const consent = consents.find((c) => c.type === consentType)
    if (!consent) return

    if (consent.isRequired && !isActive) {
      toast.error("Это согласие обязательно для использования сервиса")
      return
    }

    const now = new Date().toISOString()
    const updatedConsent: Consent = {
      ...consent,
      isActive,
      grantedAt: isActive ? now : consent.grantedAt,
      revokedAt: !isActive ? now : null,
    }

    const updatedConsents = consents.map((c) => (c.type === consentType ? updatedConsent : c))
    setConsents(updatedConsents)
    localStorage.setItem(CONSENTS_KEY, JSON.stringify(updatedConsents))

    if (user?.id) {
      try {
        const { error } = await supabase
          .from("user_consents")
          .update({
            is_active: isActive,
            granted_at: updatedConsent.grantedAt,
            revoked_at: updatedConsent.revokedAt,
          })
          .eq("user_id", user.id)
          .eq("consent_type", consentType)

        if (error) {
          console.error("Ошибка обновления согласия:", error)
          toast.error("Не удалось сохранить изменение")
          return
        }
      } catch (e) {
        console.warn("Не удалось сохранить согласие в БД:", e)
      }
    }

    toast.success(isActive ? "Согласие предоставлено" : "Согласие отозвано")
  }

  const revokeConsent = (consentType: ConsentType) => updateConsent(consentType, false)
  const grantConsent = (consentType: ConsentType) => updateConsent(consentType, true)

  return {
    consents,
    isLoading,
    updateConsent,
    revokeConsent,
    grantConsent,
    refresh: loadConsents,
  }
}

function createDefaultConsents(): Consent[] {
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

function mapDbConsent(dbConsent: any): Consent {
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
