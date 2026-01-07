import type { ClinicProfile, DoctorProfile } from "@/entities/user/types/types"
import { supabase } from "./client"

export interface ModerationRequestPayload extends DoctorProfile, ClinicProfile {}

export async function requestModeration(payload: ModerationRequestPayload) {
  return supabase.functions.invoke("moderation_request", {
    body: payload,
  })
}
