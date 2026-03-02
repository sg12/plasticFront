import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createProfile } from "../api/profile.api"
import { useNavigate } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import type { CreateProfileDto } from "../model/profile.schema"
import { userKeys } from "@/entities/user/api/user.queries"

export const useCreateProfile = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ dto, files }: { dto: CreateProfileDto; files?: File[] }) =>
      createProfile(dto, files),

    onMutate: () => {
      toast.loading("Создаем ваш профиль...", { id: "create-profile" })
    },

    onSuccess: () => {
      toast.success("Профиль успешно создан!", { id: "create-profile" })
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      // navigate(ROUTES.MAIN)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Ошибка при создании профиля"
      toast.error(message, { id: "create-profile" })
    },
  })
}
