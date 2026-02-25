import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../model/auth.store"
import * as authApi from "./auth.api"
import { toast } from "sonner"
import { userKeys } from "@/entities/user/api/user.queries"

export const authKeys = {
  all: ["auth"] as const,
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.accessToken)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
      toast.success("С возвращением!")
    },
    onError: () => {
      toast.error("Неверный логин или пароль")
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Регистрация успешна! Проверьте почту для подтверждения.")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || "Ошибка при регистрации"
      toast.error(message)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const setToken = useAuthStore((state) => state.setToken)

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setToken(null)
      queryClient.clear()
      toast.success("Вы вышли из системы")
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Инструкции по восстановлению отправлены на почту")
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      email,
      token,
      newPassword,
    }: {
      email: string
      token: string
      newPassword: string
    }) => authApi.resetPassword(email, token, newPassword),
    onSuccess: () => {
      toast.success("Пароль успешно изменен. Теперь вы можете войти.")
    },
  })
}

export const useConfirmEmail = (email: string | null, token: string | null) => {
  return useQuery({
    queryKey: [...authKeys.all, "confirm", email, token],
    queryFn: () => authApi.confirmEmail(email!, token!),
    enabled: !!email && !!token,
    retry: false,
  })
}
