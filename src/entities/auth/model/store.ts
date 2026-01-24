import { create } from "zustand"
import {
  getSession,
  onAuthStateChange,
  signOut,
  signInWithPassword as apiSignInWithPassword,
  signUp as apiSignUp,
} from "../api/api"
import type { AuthState, AuthStore } from "../types/types"
import { useUserStore } from "@/entities/user/model/store"
import { useNotificationStore } from "@/entities/notification/model/store"
import { recordLogin } from "@/features/loginHistory/api/api"
import { logger } from "@/shared/lib/logger"

const initialState: AuthState = {
  error: null,
  session: null,
  user: null,
  loading: false,
  initialized: false,
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,
  _authSubscription: null,

  signUp: async (credentials) => {
    set({ loading: true, error: null })
    const result = await apiSignUp({
      email: credentials.basic.email,
      password: credentials.basic.password!,
      options: {
        data: {
          phone: credentials.basic.phone,
          fullName: credentials.basic.fullName,
          role: credentials.role,
        },
        emailRedirectTo: `${window.location.origin}/createProfile`,
      },
    })
    if (result.error) {
      logger.error("Ошибка регистрации", new Error(result.error.message), {
        email: credentials.basic.email,
        role: credentials.role,
      })
      set({ error: result.error.message, loading: false })
    } else {
      logger.info("Пользователь успешно зарегистрирован", {
        email: credentials.basic.email,
        role: credentials.role,
      })
    }

    return result
  },

  signIn: async (credentials) => {
    set({ loading: true, error: null })
    const result = await apiSignInWithPassword({
      email: credentials.email,
      password: credentials.password!,
    })
    if (result.error) {
      set({ error: result.error.message, loading: false })
    } else if (result.data.user) {
      try {
        await recordLogin(result.data.user.id, true)
        logger.info("Пользователь успешно вошел в систему", {
          userId: result.data.user.id,
          email: result.data.user.email,
        })
      } catch (error) {
        logger.error("Ошибка при записи входа", error as Error, {
          userId: result.data.user.id,
        })
      }
      set({ loading: false })
    }

    return result
  },

  setSession: (session) => set({ session, user: session?.user ?? null }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setError: (error) => set({ error }),

  initialize: async () => {
    if (get().initialized) return

    logger.debug("Инициализация auth store")
    set({ loading: true })

    const {
      data: { session },
    } = await getSession()

    if (session) {
      logger.info("Сессия найдена, загрузка профиля", {
        userId: session.user.id,
      })
      set({ session, user: session.user })
      await useUserStore.getState().loadProfile(session.user.id)
      await useUserStore.getState().handlePostLoginActions(session.user.id)

      // Инициализация уведомлений
      const notificationStore = useNotificationStore.getState()
      notificationStore.loadNotifications()
      notificationStore.loadUnreadCount()
      notificationStore.subscribeToNotifications(session.user.id)
    } else {
      logger.debug("Сессия не найдена")
      set({ session: null, user: null })
      useUserStore.getState().reset()
      useNotificationStore.getState().reset()
    }

    set({ initialized: true, loading: false })
    logger.debug("Auth store инициализирован")

    const subscription = onAuthStateChange(async (event, session) => {
      const currentSession = get().session
      if (session?.access_token !== currentSession?.access_token) {
        set({ session, user: session?.user ?? null })
      }

      if (event === "SIGNED_IN" && session?.user.id) {
        logger.info("Пользователь вошел в систему", {
          userId: session.user.id,
        })
        if (!useUserStore.getState().profile) {
          await useUserStore.getState().loadProfile(session.user.id)
        }

        // Инициализация уведомлений при входе
        const notificationStore = useNotificationStore.getState()
        notificationStore.loadNotifications()
        notificationStore.loadUnreadCount()
        notificationStore.subscribeToNotifications(session.user.id)
      }

      if (event === "SIGNED_OUT") {
        logger.info("Пользователь вышел из системы")
        set({ session: null, user: null })
        useUserStore.getState().reset()
        useNotificationStore.getState().reset()
      }
    })

    set({ _authSubscription: subscription })
  },

  signOut: async (scope) => {
    set({ loading: true })
    try {
      logger.info("Начало выхода из системы")
      await signOut(scope)
      get().reset()
      logger.info("Пользователь успешно вышел из системы")
    } catch (error) {
      logger.error("Ошибка при выходе из системы", error as Error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  reset: () => {
    const { _authSubscription } = get()
    if (_authSubscription?.data?.subscription) {
      _authSubscription.data.subscription.unsubscribe()
    }
    set({ ...initialState, _authSubscription: null, initialized: true })
  },
}))
