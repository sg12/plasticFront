import type { LoginRecord } from "@/features/loginHistory/types/types"
import { supabase } from "@/shared/api/supabase/client"
import { parseBrowser, parseDevice, parseOS } from "@/shared/lib/userAgent"
import { logger } from "@/shared/lib/logger"

const LOGIN_HISTORY = "loginHistory"

export const recordLogin = async (userId: string, success: boolean = true) => {
  const userAgent = navigator.userAgent

  try {
    await supabase.from(LOGIN_HISTORY).insert({
      userId: userId,
      userAgent: userAgent,
      browser: parseBrowser(userAgent),
      os: parseOS(userAgent),
      device: parseDevice(userAgent),
      success,
    })
  } catch (e) {
    logger.warn("Не удалось записать историю входа", {
      userId,
      success,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

export const getLoginHistory = async (userId: string): Promise<LoginRecord[]> => {
  const { data, error } = await supabase
    .from(LOGIN_HISTORY)
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .limit(20)

  if (error) {
    if (error.code === "42P01") {
      throw new Error("Таблица loginHistory не создана. Запустите миграцию.")
    }
    throw new Error(error.message)
  }

  return data || []
}