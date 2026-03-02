import { api } from "@/shared/api/axiosInstance"
import type { ProfileResponse } from "../types/profile.types"
import type { CreateProfileDto } from "../model/profile.schema"

export const createProfile = async (
  dto: CreateProfileDto,
  files?: File[],
): Promise<ProfileResponse> => {
  const formData = new FormData()

  const appendRecursive = (data: CreateProfileDto, prefix: string) => {
    if (data instanceof Date) {
      const year = data.getFullYear()
      const month = String(data.getMonth() + 1).padStart(2, "0")
      const day = String(data.getDate()).padStart(2, "0")
      formData.append(prefix, `${year}-${month}-${day}`)
    } else if (Array.isArray(data)) {
      data.forEach((item) => {
        formData.append(prefix, item)
      })
    } else if (typeof data === "object" && data !== null && !(data instanceof File)) {
      Object.entries(data).forEach(([key, value]) => {
        appendRecursive(value, prefix ? `${prefix}[${key}]` : key)
      })
    } else {
      formData.append(prefix, data)
    }
  }

  appendRecursive(dto, "")

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("documents", file)
    })
  }

  const { data } = await api.post<ProfileResponse>("/profiles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}
