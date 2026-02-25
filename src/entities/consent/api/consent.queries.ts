import { useQuery } from "@tanstack/react-query"
import * as consentApi from "./consent.api"

export const consentKeys = {
  all: ["consents"] as const,
  list: () => [...consentKeys.all, "list"] as const,
}

export const useConsents = () => {
  return useQuery({
    queryKey: consentKeys.list(),
    queryFn: consentApi.getConsents,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}
