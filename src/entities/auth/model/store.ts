import { create } from "zustand"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { getSession, onAuthStateChange, signOut } from "../api/api"
import type { AuthState } from "../types/types"
import { getUser } from "@/entities/user/api/api"
import { mutate } from "swr"

type AuthSubscription = ReturnType<typeof onAuthStateChange>

interface AuthStore extends AuthState {
  setSession: (session: Session | null) => void
  setUser: (user: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  loadProfile: (userId: string) => Promise<void>
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  reset: () => void
  _authSubscription: AuthSubscription | null
}

const initialState: AuthState = {
  session: null,
  user: null,
  loading: true,
  initialized: false,
  profile: null,
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,
  _authSubscription: null,

  setSession: (session) => {
    set({ session, user: session?.user ?? null })
  },

  setUser: (user) => {
    set({ user })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setInitialized: (initialized) => {
    set({ initialized })
  },

  loadProfile: async (userId: string) => {
    try {
      const profile = await getUser(userId)
      set({ profile })
      await mutate(["userProfile", userId], profile, false)
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error)
      set({ profile: null })
      await mutate(["userProfile", userId], null, false)
    }
  },

  initialize: async () => {
    const { initialized, _authSubscription } = get()

    if (_authSubscription) {
      _authSubscription.data?.subscription?.unsubscribe()
      set({ _authSubscription: null })
    }

    if (initialized) return

    try {
      set({ loading: true })
      // Получаем текущую сессию
      const {
        data: { session },
      } = await getSession()

      set({
        session,
        user: session?.user ?? null,
        initialized: true,
      })

      if (session?.user?.id) {
        await get().loadProfile(session.user.id)
      } else {
        set({ profile: null })
      }

      set({ loading: false })

      const subscription = onAuthStateChange(async (_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        })

        if (session?.user?.id) {
          await get().loadProfile(session.user.id)
        } else {
          set({ profile: null })
        }
      })

      set({ _authSubscription: subscription })
    } catch (error) {
      console.error("Ошибка инициализации авторизации:", error)
      set({
        session: null,
        user: null,
        loading: false,
        initialized: true,
        profile: null,
      })
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })
      const { user } = get()
      const { error } = await signOut()
      if (error) throw error

      set({
        session: null,
        user: null,
        profile: null,
      })

      // Очищаем SWR кеш для профиля
      if (user?.id) {
        await mutate(["userProfile", user.id], null, false)
      }
    } catch (error) {
      console.error("Ошибка выхода:", error)
    } finally {
      set({ loading: false })
    }
  },

  reset: () => {
    const { _authSubscription } = get()
    if (_authSubscription) {
      _authSubscription.data?.subscription?.unsubscribe()
    }
    set({ ...initialState, _authSubscription: null })
  },
}))
