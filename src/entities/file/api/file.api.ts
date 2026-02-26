import { api } from "@/shared/api/axiosInstance"
import type { File as FileType, FILE_TYPE } from "../types/file.types"

export const getFiles = async (): Promise<FileType[]> => {
  const { data } = await api.get<FileType[]>("files")
  return data
}

export const uploadFiles = async (type: FILE_TYPE, files: File[]): Promise<FileType[]> => {
  const formData = new FormData()
  formData.append("type", type)

  files.forEach((file) => {
    formData.append("files", file)
  })

  const { data } = await api.post<FileType[]>("files", formData)
  return data
}

export const uploadAvatar = async (avatar: File): Promise<void> => {
  const formData = new FormData()

  formData.append("avatar", avatar)

  return await api.post("files/avatar", formData)
}

export const deleteFile = async (key: string): Promise<void> => {
  return await api.post("files", key)
}
