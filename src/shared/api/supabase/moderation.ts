import { supabase } from "./client";

export type ModerationRequestPayload = {
  profileId: string;
  role: string;
  fullName: string;
  email: string;
  phone?: string;
  // В идеале сюда передавать ссылки на загруженные в Storage файлы (signed urls)
  files?: Array<{ name: string; url?: string }>;
};

export async function requestModeration(payload: ModerationRequestPayload) {
  return supabase.functions.invoke("moderation_request", {
    body: payload,
  });
}
