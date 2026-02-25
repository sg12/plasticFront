import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userKeys } from "@/entities/user/api/user.queries"
import * as fileApi from "./file.api"
import { toast } from "sonner"

export const useUpdateAvatar = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fileApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success("Аватар успешно обновлён")
      onSuccess?.()
    },
    onError: () => {
      toast.error("Не удалось загрузить аватар")
    },
  })
}
