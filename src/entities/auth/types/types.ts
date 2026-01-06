import type { Profile, RoleProfile } from "@/entities/user/types/types"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"

export interface AuthState {
  error: string | null
  session: Session | null
  user: SupabaseUser | null
  loading: boolean
  initialized: boolean
  profile: Profile | RoleProfile | null
}
