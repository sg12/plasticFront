import { api } from "@/shared/api/axiosInstance"
import type { LoginResponse, RefreshResponse } from "../types/auth.types"
import type { CreateUserDto } from "@/entities/user/model/user.schema"
import type { LoginDto } from "../model/auth.schema"

export const login = async (loginDto: LoginDto): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", loginDto)
  localStorage.setItem("token", data.accessToken)
  return data
}

export const register = async (dto: CreateUserDto) => {
  const { data } = await api.post("auth/register", dto)
  return data
}

export const refresh = async (): Promise<RefreshResponse> => {
  const { data } = await api.post<RefreshResponse>("/auth/refresh")
  return data
}

export const logout = async () => {
  const { data } = await api.post("auth/logout")
  return data
}

export const confirmEmail = async (email: string, token: string) => {
  const { data } = await api.get("auth/confirm", {
    params: { email, token },
  })
  return data
}

export const sendConfirm = async () => {
  const { data } = await api.post("auth/send-confirm")
  return data
}

export const forgotPassword = async (email: string) => {
  const { data } = await api.post("auth/forgot-password", { email })
  return data
}

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const { data } = await api.post("auth/reset-password", { email, token, newPassword })
  return data
}
