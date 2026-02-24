import { api } from "@/shared/api/axiosInstance"
import type { CatalogQueryDto } from "../model/catalog.schema"
import type { Clinic, Doctor } from "@/entities/user/types/user.types"

export const getCatalog = async (query: CatalogQueryDto): Promise<Doctor[] | Clinic[]> => {
  const { data } = await api.get<Doctor[] | Clinic[]>("catalog", { params: query })
  return data
}
