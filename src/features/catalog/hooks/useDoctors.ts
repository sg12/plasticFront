/**
 * @fileoverview Хук для загрузки списка врачей с использованием SWR
 *
 * Использует обобщенный хук usePaginatedData для загрузки данных.
 *
 * @module features/catalog/hooks/useDoctors
 */

import { getDoctors } from "@/entities/catalog/api/catalog.api"
import type { CatalogDoctor, DoctorSearchParams } from "@/entities/catalog/types/catalog.types"
import { DEFAULT_DOCTOR_SEARCH_PARAMS } from "@/entities/catalog/model/catalog.constants"
import { usePaginatedData } from "../../pagination/hooks/usePaginatedData"

/**
 * Хук для получения списка врачей с фильтрацией и пагинацией
 *
 * @param params - Параметры поиска и фильтрации
 * @returns Объект с данными, состоянием загрузки и ошибкой
 */
export const useDoctors = (params?: DoctorSearchParams) => {
  const { data, pagination, isLoading, isValidating, error, mutate } = usePaginatedData<
    DoctorSearchParams,
    CatalogDoctor
  >(
    {
      fetchFn: getDoctors,
      swrKey: "doctors",
      defaultParams: DEFAULT_DOCTOR_SEARCH_PARAMS,
    },
    params,
  )

  return {
    doctors: data,
    pagination,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
