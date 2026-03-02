import { api } from "@/shared/api/axiosInstance"
import type { CatalogQueryDto } from "../model/catalog.schema"

export const getCatalog = async <T>(query: CatalogQueryDto): Promise<T[]> => {
  const { data } = await api.get<T[]>("catalog", { params: query })
  return data
}
