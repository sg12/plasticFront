import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as consentApi from "./consent.api"
import { toast } from "sonner"
import { userKeys } from "@/entities/user/api/user.queries"

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

export const useSignConsents = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (consentIds: string[]) => consentApi.signConsents(consentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success("Согласия успешно подписаны")
    },
    onError: () => {
      toast.error("Не удалось подписать документы")
    },
  })
}

export const useRevokeConsent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (consentId: string) => consentApi.revokeConsent(consentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.info("Согласие отозвано")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || "Не удалось отозвать согласие"
      toast.error(message)
    },
  })
}
