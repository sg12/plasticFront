import { create } from "zustand"
import {
  getSession,
  onAuthStateChange,
  signOut,
  signInWithPassword as apiSignInWithPassword,
  signUp as apiSignUp,
} from "../api/api"
import type { AuthState, AuthStore } from "../types/types"
import { getUser } from "@/entities/user/api/api"
import { USER_ROLES } from "@/entities/user/model/constants"
import { requestModeration } from "@/shared/api/supabase/moderation"
import { getFileUrls } from "@/entities/document/api/api"
import type { DoctorProfile, ClinicProfile } from "@/entities/user/types/types"
import { recordLogin } from "@/features/loginHistory/api/api"
import { toast } from "sonner"
import { logger } from "@/shared/lib/logger"
import type { SignOut } from '@supabase/supabase-js'

const initialState: AuthState = {
  error: null,
  session: null,
  user: null,
  loading: false,
  initialized: false,
  profile: null,
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

  loadProfile: async (userId: string) => {
    try {
      logger.debug("Начало загрузки профиля", { userId })
      const profile = await getUser(userId)

      set({ profile })
      logger.info("Профиль успешно загружен", {
        userId,
        role: profile?.role,
      })
      return profile
    } catch (error) {
      logger.error("Ошибка загрузки профиля", error as Error, { userId })
      set({ error: "Ошибка при загрузки профиля" })
      return null
    }
  },

  handlePostLoginActions: async (userId: string) => {
    const profile = get().profile

    if (!profile || !profile.role) return

    try {
      const isDoctorOrClinic =
        profile.role === USER_ROLES.DOCTOR || profile.role === USER_ROLES.CLINIC

      if (isDoctorOrClinic && profile.moderationStatus !== "approved") {
        let files: Array<{ name: string; url?: string }> = []

        const roleProfile = profile as DoctorProfile | ClinicProfile

        const doctorProfile = profile as DoctorProfile
        const clinicProfile = profile as ClinicProfile

        if (roleProfile.documents) {
          files = await getFileUrls(roleProfile.documents)
        }

        const documentsRecord: Record<string, string> = files.reduce(
          (acc, file) => {
            if (file.url) {
              acc[file.name] = file.url
            }
            return acc
          },
          {} as Record<string, string>,
        )

        const resultModeration = await requestModeration({
          id: userId,
          role: profile.role,
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          moderationStatus: profile.moderationStatus,
          moderationComment: profile.moderationComment,
          moderatedAt: profile.moderatedAt,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,

          birthDate: doctorProfile.birthDate,
          gender: doctorProfile.gender,

          licenseNumber: doctorProfile.licenseNumber,
          specialization: doctorProfile.specialization,
          experience: doctorProfile.experience,
          education: doctorProfile.education,
          workplace: doctorProfile.workplace,
          inn: doctorProfile.inn,

          legalName: clinicProfile.legalName,
          clinicInn: clinicProfile.clinicInn,
          ogrn: clinicProfile.ogrn,
          legalAddress: clinicProfile.legalAddress,
          actualAddress: clinicProfile.actualAddress,
          clinicLicense: clinicProfile.clinicLicense,
          directorName: clinicProfile.directorName,
          directorPosition: clinicProfile.directorPosition,

          documents: documentsRecord,
        } as Parameters<typeof requestModeration>[0])

        if (resultModeration.data.code === "ALREADY_SUBMITTED") {
          logger.info("Запрос на модерацию уже был отправлен", {
            userId,
            role: profile.role,
          })
          toast.message("Запрос уже был отправлен, ожидайте.", {
            description: resultModeration.data.message,
          })
          return
        }
        logger.info("Запрос на модерацию успешно отправлен", {
          userId,
          role: profile.role,
        })
      }
    } catch (error) {
      logger.error("Ошибка при проверке модерации", error as Error, {
        userId,
        role: profile?.role,
      })
    }
  },

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
      await get().loadProfile(session.user.id)
      await get().handlePostLoginActions(session.user.id)
    } else {
      logger.debug("Сессия не найдена")
      set({ session: null, user: null, profile: null })
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
        if (!get().profile) {
          await get().loadProfile(session.user.id)
        }
      }

      if (event === "SIGNED_OUT") {
        logger.info("Пользователь вышел из системы")
        set({ profile: null, session: null, user: null })
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
