import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { logger } from "@/shared/lib/logger"
import * as userApi from "./user.api"

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  byId: (id: string) => [...userKeys.all, "detail", id] as const,
}

// Запросы
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export const useUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: userKeys.byId(id!),
    queryFn: () => userApi.getUserById(id!),
    enabled: !!id,
  })
}

// Мутации
export const useUpdateMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success("Профиль успешно обновлен")
    },
    onError: (error) => {
      logger.error("Update profile error", error)
      toast.error("Ошибка при сохранении изменений")
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      userApi.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      toast.success("Пароль успешно изменен")
    },
    onError: (error) => {
      logger.error("Change password error", error)
      toast.error("Не удалось изменить пароль")
    },
  })
}

export const useDeleteMe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => {
      queryClient.clear()
      toast.success("Ваш профиль был удален")
    },
    onError: (error) => {
      logger.error("Delete profile error", error)
      toast.error("Ошибка при удалении профиля")
    },
  })
}
