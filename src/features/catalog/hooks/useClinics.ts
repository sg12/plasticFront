/**
 * @fileoverview Хук для загрузки списка клиник с использованием SWR
 *
 * Использует SWR для кэширования и автоматической ревалидации данных.
 * Параметры поиска включаются в ключ SWR для корректного кэширования.
 *
 * @module features/catalog/hooks/useClinics
 */

import useSWR from "swr"
import { getClinics } from "../../../entities/catalog/api/api"
import type {
  ClinicSearchParams,
  PaginatedResult,
  CatalogClinic,
} from "../../../entities/catalog/types/types"
import { DEFAULT_CLINIC_SEARCH_PARAMS } from "../../../entities/catalog/model/constants"

/**
 * Хук для получения списка клиник с фильтрацией и пагинацией
 *
 * @param params - Параметры поиска и фильтрации
 * @returns Объект с данными, состоянием загрузки и ошибкой
 */
export const useClinics = (params?: ClinicSearchParams) => {
  // Объединяем параметры с значениями по умолчанию
  const searchParams: ClinicSearchParams = {
    ...DEFAULT_CLINIC_SEARCH_PARAMS,
    ...params,
  }

  // Создаем ключ SWR из параметров поиска
  const swrKey = [
    "clinics",
    JSON.stringify(
      Object.keys(searchParams)
        .sort()
        .reduce(
          (acc, key) => {
            const value = searchParams[key as keyof ClinicSearchParams]
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = value
            }
            return acc
          },
          {} as Record<string, unknown>,
        ),
    ),
  ]

  const { data, error, isLoading, mutate, isValidating } = useSWR<PaginatedResult<CatalogClinic>>(
    swrKey,
    () => getClinics(searchParams),
  )

  return {
    clinics: data?.data,
    pagination: data
      ? {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        }
      : {
          page: searchParams.page || 1,
          limit: searchParams.limit || 20,
          total: 0,
          totalPages: 0,
        },
    isLoading: isLoading && !data, // Показываем загрузку только при первом запросе
    isValidating, // Флаг валидации (обновление данных в фоне)
    error: error?.message ?? null,
    mutate,
  }
}
