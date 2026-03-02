import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userKeys } from "@/entities/user/api/user.queries"
import * as fileApi from "./file.api"
import { toast } from "sonner"

export const fileKeys = {
  all: ["files"] as const,
  list: () => [...fileKeys.all, "list"] as const,
}

export const useFiles = () => {
  return useQuery({
    queryKey: fileKeys.list(),
    queryFn: fileApi.getFiles,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fileApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success("Аватар успешно обновлён")
    },
    onError: () => {
      toast.error("Не удалось загрузить аватар")
    },
  })
}
