import type { LoginRecord } from "@/features/loginHistory/types/types"
import { supabase } from "@/shared/api/supabase/client"
import { parseBrowser, parseDevice, parseOS } from "@/shared/lib/userAgent"

export const recordLogin = async (userId: string, success: boolean = true) => {
  const userAgent = navigator.userAgent

  try {
    await supabase.from("login_history").insert({
      user_id: userId,
      user_agent: userAgent,
      browser: parseBrowser(userAgent),
      os: parseOS(userAgent),
      device: parseDevice(userAgent),
      success,
    })
  } catch (e) {
    console.warn("Не удалось записать историю входа:", e)
  }
}

export const fetchLoginHistory = async (userId: string): Promise<LoginRecord[]> => {
  const { data, error } = await supabase
    .from("login_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    if (error.code === "42P01") {
      throw new Error("Таблица login_history не создана. Запустите миграцию.")
    }
    throw new Error(error.message)
  }

  return data || []
}
