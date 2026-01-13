import type { SignInFormData } from "@/features/auth/ui/signIn/model/types"
import type { SignUpFormData } from "@/features/auth/ui/signUp/types/types"
import type { Session, SignOut, User as SupabaseUser } from "@supabase/supabase-js"
import {
  onAuthStateChange,
  signInWithPassword as apiSignInWithPassword,
  signUp as apiSignUp,
} from "../api/api"

export interface AuthState {
  error: string | null
  session: Session | null
  user: SupabaseUser | null
  loading: boolean
  initialized: boolean
}

type AuthSubscription = ReturnType<typeof onAuthStateChange>

export interface AuthStore extends AuthState {
  error: string | null

  setSession: (session: Session | null) => void
  setUser: (user: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void

  signUp: (credentials: SignUpFormData) => ReturnType<typeof apiSignUp>
  signIn: (credentials: SignInFormData) => ReturnType<typeof apiSignInWithPassword>
  signOut: (scope: SignOut["scope"]) => Promise<void>
  initialize: () => Promise<void>
  reset: () => void

  _authSubscription: AuthSubscription | null
}
