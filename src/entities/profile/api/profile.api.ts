import { api } from "@/shared/api/axiosInstance"
import type { ProfileResponse } from "../types/profile.types"
import type { CreateProfileDto } from "../model/profile.schema"

export const createProfile = async (
  dto: CreateProfileDto,
  files?: File[],
): Promise<ProfileResponse> => {
  const formData = new FormData()

  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    }
  })

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("documents", file)
    })
  }

  const { data } = await api.post<ProfileResponse>("/profiles", formData)
  return data
}
