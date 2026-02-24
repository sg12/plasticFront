/**
 * @fileoverview Хук для загрузки списка клиник с использованием SWR
 *
 * Использует обобщенный хук usePaginatedData для загрузки данных.
 *
 * @module features/catalog/hooks/useClinics
 */

import { getClinics } from "../../../entities/catalog/api/catalog.api"
import type {
  ClinicSearchParams,
  CatalogClinic,
} from "../../../entities/catalog/types/catalog.types"
import { DEFAULT_CLINIC_SEARCH_PARAMS } from "../../../entities/catalog/model/catalog.constants"
import { usePaginatedData } from "../../pagination/hooks/usePaginatedData"

/**
 * Хук для получения списка клиник с фильтрацией и пагинацией
 *
 * @param params - Параметры поиска и фильтрации
 * @returns Объект с данными, состоянием загрузки и ошибкой
 */
export const useClinics = (params?: ClinicSearchParams) => {
  const { data, pagination, isLoading, isValidating, error, mutate } = usePaginatedData<
    ClinicSearchParams,
    CatalogClinic
  >(
    {
      fetchFn: getClinics,
      swrKey: "clinics",
      defaultParams: DEFAULT_CLINIC_SEARCH_PARAMS,
    },
    params,
  )

  return {
    clinics: data,
    pagination,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
