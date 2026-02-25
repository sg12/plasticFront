import { api } from "@/shared/api/axiosInstance"
import type { Consent } from "../types/consent.types"

export const getConsents = async (): Promise<Consent[]> => {
  const { data } = await api.get<Consent[]>("consents")
  return data
}
