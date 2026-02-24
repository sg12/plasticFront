import { api } from "@/shared/api/axiosInstance"
import type { Relationship, RELATIONSHIP_STATUS } from "../types/relationship.types"

export const getRelationships = async (): Promise<Relationship[]> => {
  const { data } = await api.get<Relationship[]>("relationship")
  return data
}

export const inviteDoctor = async (doctorId: string): Promise<Relationship> => {
  const { data } = await api.post<Relationship>(`relationship/${doctorId}/invite`)
  return data
}

export const changeStatus = async (
  id: string,
  status: RELATIONSHIP_STATUS,
): Promise<Relationship> => {
  const { data } = await api.post<Relationship>(`relationship/${id}`, {}, { params: { status } })
  return data
}

export const archiveRelationship = async (id: string): Promise<void> => {
  const { data } = await api.delete(`relationship/${id}`)
  return data
}
