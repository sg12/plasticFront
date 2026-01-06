import { create } from "zustand"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import {
  getSession,
  onAuthStateChange,
  signOut,
  signInWithPassword as apiSignInWithPassword,
  signUp as apiSignUp,
} from "../api/api"
import type { AuthState } from "../types/types"
import { getUser } from "@/entities/user/api/api"
import { USER_ROLES } from "@/entities/user/model/constants"
import { requestModeration } from "@/shared/api/supabase/moderation"
import { getFileUrls } from "@/entities/document/api/api"
import type { DoctorProfile, ClinicProfile } from "@/entities/user/types/types"
import { recordLogin } from "@/features/loginHistory/api/api"
import type { SignInFormData } from "@/features/auth/ui/signIn/model/types"
import type { SignUpFormData } from "@/features/auth/ui/signUp/model/types"
import { toast } from "sonner"

type AuthSubscription = ReturnType<typeof onAuthStateChange>

interface AuthStore extends AuthState {
  error: string | null

  setSession: (session: Session | null) => void
  setUser: (user: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void

  signUp: (credentials: SignUpFormData) => ReturnType<typeof apiSignUp>
  signIn: (credentials: SignInFormData) => ReturnType<typeof apiSignInWithPassword>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  reset: () => void

  loadProfile: (userId: string) => Promise<AuthState["profile"]>
  handlePostLoginActions: (userId: string) => Promise<void>
  _authSubscription: AuthSubscription | null
}

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
    console.log(credentials)

    set({ loading: true, error: null })
    const result = await apiSignUp({
      email: credentials.basic.email,
      password: credentials.basic.password!,
      options: {
        data: {
          phone: credentials.basic.phone,
          full_name: credentials.basic.fullName,
          role: credentials.role,
        },
        emailRedirectTo: `${window.location.origin}/createProfile`,
      },
    })
    if (result.error) {
      set({ error: result.error.message, loading: false })
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
      } catch (error) {
        console.error("Ошибка при записи входа", error)
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
      const profile = await getUser(userId)
      console.log(profile)

      set({ profile })
      return profile
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error)
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

      if (isDoctorOrClinic && profile.moderation_status !== "approved") {
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
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          moderation_status: profile.moderation_status,
          moderation_comment: profile.moderation_comment,
          moderated_at: profile.moderated_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,

          birth_date: doctorProfile.birth_date,
          gender: doctorProfile.gender,

          license_number: doctorProfile.license_number,
          specialization: doctorProfile.specialization,
          experience: doctorProfile.experience,
          education: doctorProfile.education,
          workplace: doctorProfile.workplace,
          inn: doctorProfile.inn,

          legal_name: clinicProfile.legal_name,
          clinic_inn: clinicProfile.clinic_inn,
          ogrn: clinicProfile.ogrn,
          legal_address: clinicProfile.legal_address,
          actual_address: clinicProfile.actual_address,
          clinic_license: clinicProfile.clinic_license,
          director_name: clinicProfile.director_name,
          director_position: clinicProfile.director_position,

          documents: documentsRecord,
        })

        if (resultModeration.data.code === "ALREADY_SUBMITTED") {
          toast.message("Запрос уже был отправлен, ожидайте.", {
            description: resultModeration.data.message,
          })
          return
        }
      }
    } catch (error) {
      console.error("Failed during moderation check:", error)
    }
  },

  initialize: async () => {
    if (get().initialized) return

    set({ loading: true })

    const {
      data: { session },
    } = await getSession()

    if (session) {
      set({ session, user: session.user })
      await get().loadProfile(session.user.id)
      await get().handlePostLoginActions(session.user.id)
    } else {
      set({ session: null, user: null, profile: null })
    }

    set({ initialized: true, loading: false })

    const subscription = onAuthStateChange(async (event, session) => {
      const currentSession = get().session
      if (session?.access_token !== currentSession?.access_token) {
        set({ session, user: session?.user ?? null })
      }

      if (event === "SIGNED_IN" && session?.user.id) {
        if (!get().profile) {
          await get().loadProfile(session.user.id)
        }
      }

      if (event === "SIGNED_OUT") {
        set({ profile: null, session: null, user: null })
      }
    })

    set({ _authSubscription: subscription })
  },

  signOut: async () => {
    set({ loading: true })
    try {
      await signOut("local")
      get().reset()
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
