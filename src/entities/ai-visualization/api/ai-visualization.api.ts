import { api } from "@/shared/api/axiosInstance"
import type { VisualizeAiDto } from "../model/ai-visualization.schema"

export const getHistory = async (): Promise<File[]> => {
  const { data } = await api.get("ai-visualization")
  return data
}

export const visualize = async (file: File, visualizeAiDto: VisualizeAiDto) => {
  const formData = new FormData()

  formData.append("file", file)

  formData.append("zone", visualizeAiDto.zone)
  formData.append("description", visualizeAiDto.description)

  const { data } = await api.post("ai-visualization", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

export const deleteVisualization = async (key: string): Promise<void> => {
  return await api.delete("ai-visualization", { data: key })
}
