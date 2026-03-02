import { api } from "@/shared/api/axiosInstance"
import type { User } from "@/entities/user/types/user.types"
import type { UpdateUserDto } from "../model/user.schema"

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("users/me")
  return data
}

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get<User>(`users/${id}`)
  return data
}

export const addUserToFavorite = async (id: string) => {
  return await api.post(`users/${id}`)
}

export const updateMe = async (dto: UpdateUserDto): Promise<User> => {
  const { data } = await api.patch<User>("users/me", dto)
  return data
}

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.patch("/users/change-password", { oldPassword, newPassword })
}

export const deleteMe = async (): Promise<void> => {
  await api.delete("/users")
}
