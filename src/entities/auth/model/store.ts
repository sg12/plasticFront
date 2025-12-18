import { create } from "zustand";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { getSession, onAuthStateChange, signOut } from "../api/api";
import type { AuthState } from "../types/types";
import { getUser } from "@/entities/user/api/api";

interface AuthStore extends AuthState {
  setSession: (session: Session | null) => void;
  setUser: (user: SupabaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  loadProfile: (userId: string) => Promise<void>;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
}

const initialState: AuthState = {
  session: null,
  user: null,
  loading: true,
  initialized: false,
  profile: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },

  setUser: (user) => {
    set({ user });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setInitialized: (initialized) => {
    set({ initialized });
  },

  loadProfile: async (userId: string) => {
    try {
      const profile = await getUser(userId);
      set({ profile });
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
      set({ profile: null });
    }
  },

  initialize: async () => {
    const { initialized } = get();
    if (initialized) return;

    set({ loading: true });

    try {
      // Получаем текущую сессию
      const {
        data: { session },
      } = await getSession();

      set({
        session,
        user: session?.user ?? null,
        initialized: true,
      });

      if (session?.user?.id) {
        await get().loadProfile(session.user.id);
      } else {
        set({ profile: null });
      }

      set({ loading: false });

      // Подписываемся на изменения состояния авторизации
      onAuthStateChange(async (_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });

        if (session?.user?.id) {
          await get().loadProfile(session.user.id);
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error("Ошибка инициализации авторизации:", error);
      set({
        session: null,
        user: null,
        loading: false,
        initialized: true,
        profile: null,
      });
    }
  },

  signOut: async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Ошибка выхода:", error);
      }
      set({
        session: null,
        user: null,
        loading: false,
        profile: null,
      });
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  },

  reset: () => {
    set(initialState);
  },
}));
