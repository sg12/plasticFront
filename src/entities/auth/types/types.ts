import type { Profile, DoctorProfile, ClinicProfile, PatientProfile } from "@/entities/user/types/types";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthState {
  session: Session | null;
  user: SupabaseUser | null;
  loading: boolean;
  initialized: boolean;
  profile: Profile | DoctorProfile | ClinicProfile | PatientProfile | null;
}
