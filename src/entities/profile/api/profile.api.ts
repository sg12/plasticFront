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
      const formKey = `patient[${key}]`

      if (Array.isArray(value)) {
        value.forEach((val) => formData.append(`${formKey}[]`, val))
      } else if (value instanceof Date) {
        formData.append(formKey, value.toISOString())
      } else {
        formData.append(formKey, String(value))
      }
    }
  })

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
