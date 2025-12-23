import { useState, useEffect } from "react"
import { supabase } from "@/shared/api/supabase/client"
import { useAuthStore } from "@/entities/auth/model/store"

export interface LoginRecord {
  id: string
  user_id: string
  ip_address: string | null
  user_agent: string | null
  browser: string | null
  os: string | null
  device: string | null
  location: string | null
  created_at: string
  success: boolean
}

export function useLoginHistory() {
  const { user } = useAuthStore()
  const [history, setHistory] = useState<LoginRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadHistory()
    }
  }, [user?.id])

  const loadHistory = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("login_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (fetchError) {
        if (fetchError.code === "42P01") {
          setError("Таблица login_history не создана. Запустите миграцию.")
        } else {
          setError(fetchError.message)
        }
        return
      }

      setHistory(data || [])
    } catch (e) {
      console.error("Ошибка загрузки истории входов:", e)
      setError("Не удалось загрузить историю входов")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    history,
    isLoading,
    error,
    refresh: loadHistory,
  }
}

// Утилита для записи входа (вызывать при успешном логине)
export async function recordLogin(userId: string, success: boolean = true) {
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
    // Не критичная ошибка, просто логируем
    console.warn("Не удалось записать историю входа:", e)
  }
}

function parseBrowser(ua: string): string {
  if (ua.includes("Edg/")) return "Edge"
  if (ua.includes("Chrome")) return "Chrome"
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Safari")) return "Safari"
  if (ua.includes("Opera")) return "Opera"
  return "Неизвестный"
}

function parseOS(ua: string): string {
  if (ua.includes("Windows")) return "Windows"
  if (ua.includes("Mac OS")) return "macOS"
  if (ua.includes("Linux")) return "Linux"
  if (ua.includes("Android")) return "Android"
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
  return "Неизвестная"
}

function parseDevice(ua: string): string {
  if (ua.includes("Mobile") || ua.includes("Android")) return "Мобильный"
  if (ua.includes("Tablet") || ua.includes("iPad")) return "Планшет"
  return "Компьютер"
}
