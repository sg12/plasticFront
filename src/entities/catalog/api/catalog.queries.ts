import { useQuery, keepPreviousData, type UseQueryOptions } from "@tanstack/react-query"
import * as catalogApi from "./catalog.api"
import type { CatalogQueryDto } from "../model/catalog.schema"

export const catalogKeys = {
  all: ["catalog"] as const,
  filtered: (query: CatalogQueryDto) => [...catalogKeys.all, { ...query }] as const,
}

export const useCatalog = <T>(query: CatalogQueryDto, options?: UseQueryOptions<T[]>) => {
  return useQuery({
    queryKey: catalogKeys.filtered(query),
    queryFn: () => catalogApi.getCatalog<T>(query),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  })
}
