/**
 * @fileoverview Обобщенный хук для загрузки данных с пагинацией
 *
 * Использует SWR для кэширования и автоматической ревалидации данных.
 * Параметры поиска включаются в ключ SWR для корректного кэширования.
 *
 * @module features/catalog/hooks/usePaginatedData
 */

import useSWR from "swr"
import type { PaginatedResult, PaginationInfo } from "../types/types"

/**
 * Конфигурация для обобщенного хука загрузки данных
 *
 * @template TSearchParams - Тип параметров поиска
 * @template TData - Тип данных в результате
 */
export interface PaginatedDataConfig<TSearchParams, TData> {
  /** Функция для загрузки данных */
  fetchFn: (params: TSearchParams) => Promise<PaginatedResult<TData>>
  /** Базовый ключ для SWR (например, "doctors" или "clinics") */
  swrKey: string
  /** Дефолтные параметры поиска */
  defaultParams: TSearchParams
}

/**
 * Результат работы хука usePaginatedData
 *
 * @template TData - Тип данных
 */
export interface UsePaginatedDataReturn<TData> {
  /** Данные (массив элементов) */
  data: TData[] | undefined
  /** Информация о пагинации */
  pagination: PaginationInfo
  /** Состояние загрузки (только при первом запросе) */
  isLoading: boolean
  /** Флаг валидации (обновление данных в фоне) */
  isValidating: boolean
  /** Ошибка загрузки */
  error: string | null
  /** Функция для ручной ревалидации данных */
  mutate: () => Promise<PaginatedResult<TData> | undefined>
}

/**
 * Обобщенный хук для получения данных с фильтрацией и пагинацией
 *
 * @template TSearchParams - Тип параметров поиска
 * @template TData - Тип данных в результате
 *
 * @param config - Конфигурация хука
 * @param params - Параметры поиска и фильтрации (опционально)
 * @returns Объект с данными, состоянием загрузки и ошибкой
 *
 * @example
 * ```typescript
 * const { data, pagination, isLoading, error } = usePaginatedData(
 *   {
 *     fetchFn: getDoctors,
 *     swrKey: "doctors",
 *     defaultParams: DEFAULT_DOCTOR_SEARCH_PARAMS,
 *   },
 *   searchParams
 * )
 * ```
 */
export const usePaginatedData = <TSearchParams extends Record<string, any>, TData>(
  config: PaginatedDataConfig<TSearchParams, TData>,
  params?: Partial<TSearchParams>,
): UsePaginatedDataReturn<TData> => {
  const { fetchFn, swrKey, defaultParams } = config

  // Объединяем параметры с значениями по умолчанию
  const searchParams: TSearchParams = {
    ...defaultParams,
    ...params,
  } as TSearchParams

  // Создаем ключ SWR из параметров поиска
  const swrKeyArray = [
    swrKey,
    JSON.stringify(
      Object.keys(searchParams)
        .sort()
        .reduce(
          (acc, key) => {
            const value = searchParams[key as keyof TSearchParams]
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = value
            }
            return acc
          },
          {} as Record<string, unknown>,
        ),
    ),
  ]

  const { data, error, isLoading, mutate, isValidating } = useSWR<PaginatedResult<TData>>(
    swrKeyArray,
    () => fetchFn(searchParams),
  )

  return {
    data: data?.data,
    pagination: data
      ? {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        }
      : {
          page: (searchParams.page as number) || 1,
          limit: (searchParams.limit as number) || 20,
          total: 0,
          totalPages: 0,
        },
    isLoading: isLoading && !data, // Показываем загрузку только при первом запросе
    isValidating, // Флаг валидации (обновление данных в фоне)
    error: error?.message ?? null,
    mutate,
  }
}
