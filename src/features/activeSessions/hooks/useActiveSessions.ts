import useSWR from "swr"
import type { Session } from "@supabase/supabase-js"
import { parseBrowser } from "@/shared/lib/userAgent"
import { getSession } from "@/entities/auth/api/api"
import { logger } from "@/shared/lib/logger"

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
      logger.error("Ошибка получения сессии", new Error(error.message), {
        errorCode: error.status,
      })
      throw error
    }

    if (data.session) {
      return parseSession(data.session)
    }

    return null
  } catch (error) {
    logger.error("Ошибка в fetchSession", error as Error)
    throw error
  }
}

export const useActiveSessions = () => {
  const { data, isLoading, error, mutate } = useSWR(["activeSession"], fetchSession)

  return {
    session: data ?? null,
    isLoading: isLoading && !error,
    refresh: mutate,
    error: error?.message ?? null,
  }
}