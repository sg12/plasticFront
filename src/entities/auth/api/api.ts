import { supabase } from "@/shared/api/supabase/client";
import type {
  AuthChangeEvent,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

export const signInWithPassword = (
  credentials: SignInWithPasswordCredentials
) => {
  return supabase.auth.signInWithPassword(credentials);
};

export const signUp = (credentials: SignUpWithPasswordCredentials) => {
  return supabase.auth.signUp(credentials);
};

export const signOut = () => {
  return supabase.auth.signOut();
};

export const getSession = () => {

  return supabase.auth.getSession();
};

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};
