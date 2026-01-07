import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import type { Session } from "@supabase/supabase-js"
import { parseBrowser } from "@/shared/lib/userAgent"
import { getSession, signOut } from "@/entities/auth/api/api"

export interface SessionInfo {
  accessToken: string
  expiresAt: Date | null
  createdAt: Date | null
  userAgent: string
  ip: string | null
}

const parseSession = (session: Session): SessionInfo => {
  const userAgent = navigator.userAgent

  return {
    accessToken: session.access_token.slice(0, 20) + "...",
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null,
    createdAt: session.user?.created_at ? new Date(session.user.created_at) : null,
    userAgent: parseBrowser(userAgent),
    ip: null,
  }
}

const fetchSession = async (): Promise<SessionInfo | null> => {
  try {
    const { data, error } = await getSession()

    if (error) {
      console.error("Ошибка получения сессии:", error)
      // Выбрасываем ошибку, чтобы SWR правильно обработал состояние
      throw error
    }

    if (data.session) {
      return parseSession(data.session)
    }

    return null
  } catch (error) {
    // Гарантируем, что ошибка будет выброшена для SWR
    console.error("Ошибка в fetchSession:", error)
    throw error
  }
}

export const useActiveSessions = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { data, isLoading, error, mutate } = useSWR("activeSession", fetchSession, {
    revalidateOnFocus: false,
    refreshInterval: 30 * 1000,
    dedupingInterval: 1 * 60 * 1000,
    errorRetryCount: 2,
    errorRetryInterval: 1000,
    shouldRetryOnError: (error) => {
      return error?.message?.includes("network") || error?.message?.includes("timeout")
    },
    keepPreviousData: true,
    onError: (error) => {
      console.error("SWR error in useActiveSessions:", error)
    },
  })

  const signOutAll = async () => {
    setIsSigningOut(true)
    try {
      await signOut("global")
      toast.success("Вы вышли со всех устройств")
      await mutate()
      window.location.reload()
    } catch (error) {
      toast.error("Ошибка при выходе")
    } finally {
      setIsSigningOut(false)
    }
  }

  return {
    session: data ?? null,
    isLoading: isLoading && !error,
    isSigningOut,
    signOutAll,
    refresh: mutate,
    error: error?.message ?? null,
  }
}
