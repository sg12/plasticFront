import { api } from "@/shared/api/axiosInstance"
import type { Service } from "../types/service.types"
import type { ArchiveServiceDto, CreateServiceDto, UpdateServiceDto } from "../model/service.schema"

export const getServices = async (): Promise<Service[]> => {
  const { data } = await api.get<Service[]>("services")
  return data
}

export const createService = async (createServiceDto: CreateServiceDto): Promise<Service> => {
  const { data } = await api.post<Service>("services", createServiceDto)
  return data
}

export const updateService = async (
  id: string,
  updateServiceDto: UpdateServiceDto,
): Promise<Service> => {
  const { data } = await api.patch<Service>(`services/${id}`, updateServiceDto)
  return data
}

export const archiveService = async (
  id: string,
  archiveServiceDto: ArchiveServiceDto,
): Promise<void> => {
  return await api.post(`services/${id}`, archiveServiceDto)
}
