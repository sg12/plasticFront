import { api } from "@/shared/api/axiosInstance"
import type { Consent } from "../types/consent.types"

export const getConsents = async (): Promise<Consent[]> => {
  const { data } = await api.get<Consent[]>("consents")
  return data
}

export const signConsents = async (consentIds: string[]): Promise<void> => {
  await api.post("consents/sign", { consentIds })
}

export const revokeConsent = async (consentId: string): Promise<void> => {
  await api.post(`consents/${consentId}/revoke`)
}
