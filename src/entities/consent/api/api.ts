import { supabase } from "@/shared/api/supabase/client"
import { type Consent, type ConsentType } from "../types/types"
import { logger } from "@/shared/lib/logger"
import type { User } from "@supabase/supabase-js"

const USER_CONSENTS = "userConsents"

/**
 * Получает все согласия пользователя из базы данных
 *
 * Примечание: Согласия автоматически создаются при создании профиля пользователя
 * через database trigger в Supabase (см. supabase/migrations/create_consents_trigger.sql)
 */
export const getUserConsents = async (userId: User["id"]): Promise<Consent[]> => {
  const { data, error } = await supabase.from(USER_CONSENTS).select("*").eq("userId", userId)

  if (error) {
    logger.error("Ошибка получения согласий", new Error(error.message), {
      userId,
      errorCode: error.code,
    })
    throw error
  }

  if (!data || data.length === 0) {
    return []
  }

  return data
}

/**
 * Обновляет согласие пользователя
 */
export const updateUserConsent = async (
  userId: User["id"],
  consentType: ConsentType,
  isActive: boolean,
): Promise<void> => {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from(USER_CONSENTS)
    .update({
      isActive: isActive,
      grantedAt: isActive ? now : null,
      revokedAt: !isActive ? now : null,
    })
    .eq("userId", userId)
    .eq("type", consentType)

  if (error) {
    logger.error("Ошибка обновления согласия", new Error(error.message), {
      userId,
      consentType,
      isActive,
      errorCode: error.code,
    })
    throw error
  }
}
