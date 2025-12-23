import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/shared/api/supabase/client"
import type { Session } from "@supabase/supabase-js"

export interface SessionInfo {
  accessToken: string
  expiresAt: Date | null
  createdAt: Date | null
  userAgent: string
  ip: string | null
}

export function useActiveSessions() {
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Ошибка получения сессии:", error)
        return
      }

      if (data.session) {
        setSession(parseSession(data.session))
      }
    } catch (e) {
      console.error("Исключение при загрузке сессии:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const parseSession = (session: Session): SessionInfo => {
    // Парсим user-agent из токена или используем текущий браузер
    const userAgent = navigator.userAgent

    return {
      accessToken: session.access_token.slice(0, 20) + "...",
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null,
      createdAt: session.user?.created_at ? new Date(session.user.created_at) : null,
      userAgent: parseUserAgent(userAgent),
      ip: null, // IP недоступен на клиенте
    }
  }

  const parseUserAgent = (ua: string): string => {
    // Простой парсинг user-agent
    if (ua.includes("Chrome")) return "Chrome"
    if (ua.includes("Firefox")) return "Firefox"
    if (ua.includes("Safari")) return "Safari"
    if (ua.includes("Edge")) return "Edge"
    if (ua.includes("Opera")) return "Opera"
    return "Неизвестный браузер"
  }

  const signOutAll = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Вы вышли со всех устройств")
      // Перезагружаем страницу для перенаправления на логин
      window.location.reload()
    } catch (e) {
      console.error("Ошибка выхода:", e)
      toast.error("Ошибка при выходе")
    } finally {
      setIsSigningOut(false)
    }
  }

  const signOutCurrent = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Вы вышли из аккаунта")
      window.location.reload()
    } catch (e) {
      console.error("Ошибка выхода:", e)
      toast.error("Ошибка при выходе")
    } finally {
      setIsSigningOut(false)
    }
  }

  return {
    session,
    isLoading,
    isSigningOut,
    signOutAll,
    signOutCurrent,
    refresh: loadSession,
  }
}
