import type { RoleProfile } from "@/entities/user/types/types"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"

export interface AuthState {
  session: Session | null
  user: SupabaseUser | null
  loading: boolean
  initialized: boolean
  profile: RoleProfile | null
}
