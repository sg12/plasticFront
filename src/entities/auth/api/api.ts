import { supabase } from "@/shared/api/supabase/client"
import type {
  AuthChangeEvent,
  Session,
  SignInWithPasswordCredentials,
  SignOut,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js"

export const signInWithPassword = (credentials: SignInWithPasswordCredentials) => {
  return supabase.auth.signInWithPassword(credentials)
}

export const signUp = (credentials: SignUpWithPasswordCredentials) => {
  return supabase.auth.signUp(credentials)
}

export const signOut = (scope?: SignOut["scope"]) => {
  return supabase.auth.signOut({ scope: scope })
}

export const getSession = () => {
  return supabase.auth.getSession()
}

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) => {
  return supabase.auth.onAuthStateChange(callback)
}
