import { supabase } from "@/shared/api/supabase/client"
import { CONSENT_TYPES, type ConsentType } from "../types/types"

export async function saveInitialConsents(userId: string) {
  const now = new Date().toISOString()

  // Все согласия активны при регистрации
  const consentsToSave = Object.entries(CONSENT_TYPES).map(([type, _info]) => ({
    user_id: userId,
    consent_type: type as ConsentType,
    is_active: true,
    granted_at: now,
    revoked_at: null,
  }))

  const { error } = await supabase.from("user_consents").insert(consentsToSave)

  // Игнорируем ошибку дубликата - значит согласия уже созданы
  if (error && error.code === "23505") {
    return { error: null }
  }

  if (error) {
    console.error("Ошибка сохранения согласий:", error)
  }

  return { error }
}
