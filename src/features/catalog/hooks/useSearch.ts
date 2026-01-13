/**
 * @fileoverview Обобщенный хук для поиска с дебаунсингом и SWR
 *
 * Дебаунсинг - это техника, которая задерживает выполнение функции
 * до тех пор, пока не пройдет определенное время без новых вызовов.
 * Это особенно полезно для поисковых запросов, чтобы не делать
 * запрос к API при каждом нажатии клавиши.
 *
 * Использует SWR для кэширования и автоматической ревалидации данных.
 *
 * @module features/catalog/hooks/useSearch
 */

import { useCallback, useEffect, useRef, useState } from "react"
import type { PaginationInfo } from "../../../entities/catalog/types/types"

const DEBOUNCE_DELAY = 500

/**
 * Конфигурация для обобщенного хука поиска
 */
export interface SearchConfig<TSearchParams extends { searchQuery?: string; page?: number }> {
  /** Хук для загрузки данных (useClinics или useDoctors) */
  useDataHook: (params?: TSearchParams) => {
    [key: string]: unknown
    pagination: PaginationInfo
    isLoading: boolean
    error: string | null
    mutate: unknown
  }
  /** Фильтры из store (clinicFilters или doctorFilters) */
  storeFilters: TSearchParams
  /** Значения по умолчанию для параметров поиска */
  defaultParams: TSearchParams
  /** Название поля с данными в результате хука (clinics или doctors) */
  dataFieldName: string
}

/**
 * Результат работы хука поиска
 */
export interface UseSearchReturn<TSearchParams, TData> {
  /** Данные из SWR */
  data: TData[] | undefined
  /** Информация о пагинации */
  pagination: PaginationInfo
  /** Состояние загрузки */
  isLoading: boolean
  /** Ошибка загрузки */
  error: string | null
  /** Параметры поиска */
  searchQuery: string
  searchParams: TSearchParams
  /** Методы управления поиском */
  setSearchQuery: (query: string) => void
  applyFilters: (params: Partial<TSearchParams>) => void
  resetFilters: () => void
  executeSearch: (params: Partial<TSearchParams>) => void
  refresh: () => void
}

/**
 * Обобщенный хук для поиска с дебаунсингом
 *
 * @template TSearchParams - Тип параметров поиска (ClinicSearchParams или DoctorSearchParams)
 * @template TData - Тип данных (CatalogClinic или CatalogDoctor)
 * @template TFilterKey - Ключ фильтров в store ("clinicFilters" | "doctorFilters")
 *
 * @param initialParams - Начальные параметры поиска
 * @param config - Конфигурация хука
 * @returns Объект с данными, состоянием и методами управления поиском
 *
 * @example
 * ```typescript
 * const search = useSearch(initialParams, {
 *   useDataHook: useClinics,
 *   storeFilters: clinicFilters,
 *   defaultParams: DEFAULT_CLINIC_SEARCH_PARAMS,
 *   dataFieldName: 'clinics'
 * })
 * ```
 */
export const useSearch = <TSearchParams extends { searchQuery?: string; page?: number }, TData>(
  initialParams: TSearchParams | undefined,
  config: SearchConfig<TSearchParams>,
): UseSearchReturn<TSearchParams, TData> => {
  const { useDataHook, storeFilters, defaultParams, dataFieldName } = config

  const [searchParams, setSearchParams] = useState<TSearchParams>(
    () =>
      ({
        ...defaultParams,
        ...storeFilters,
        ...initialParams,
      }) as TSearchParams,
  )

  const [searchQuery, setSearchQuery] = useState(initialParams?.searchQuery || "")
  const debounceTimerRef = useRef<number | null>(null)

  // Используем переданный хук с текущими параметрами
  const dataHookResult = useDataHook(searchParams)
  const data = (dataHookResult[dataFieldName] as TData[] | undefined) ?? undefined
  const { pagination, isLoading, error, mutate } = dataHookResult

  // Преобразуем mutate в функцию, если это необходимо
  const refresh = (typeof mutate === "function" ? mutate : () => {}) as () => void

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const executeSearch = useCallback(
    (params: Partial<TSearchParams>) => {
      const newParams: TSearchParams = {
        ...defaultParams,
        ...storeFilters,
        ...searchParams,
        ...params,
        page: params.page ?? 1, // Сбрасываем на первую страницу при новом поиске
      } as TSearchParams

      setSearchParams(newParams)
      // SWR автоматически перезагрузит данные при изменении параметров
    },
    [storeFilters, searchParams, defaultParams],
  )

  const updateSearchQuery = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        executeSearch({ searchQuery: newQuery, page: 1 } as Partial<TSearchParams>)
      }, DEBOUNCE_DELAY)
    },
    [executeSearch],
  )

  const applyFilters = useCallback(
    (params: Partial<TSearchParams>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      executeSearch({ ...params, page: 1 })
    },
    [executeSearch],
  )

  const resetFilters = useCallback(() => {
    setSearchQuery("")
    executeSearch({ page: 1 } as Partial<TSearchParams>)
  }, [executeSearch])

  return {
    // Данные из SWR
    data,
    pagination,
    isLoading,
    error,

    // Параметры поиска
    searchQuery,
    searchParams,

    // Методы
    setSearchQuery: updateSearchQuery,
    applyFilters,
    resetFilters,
    executeSearch,
    refresh,
  }
}
