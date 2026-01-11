/**
 * @fileoverview Хук для поиска врачей с дебаунсингом и SWR
 *
 * Дебаунсинг - это техника, которая задерживает выполнение функции
 * до тех пор, пока не пройдет определенное время без новых вызовов.
 * Это особенно полезно для поисковых запросов, чтобы не делать
 * запрос к API при каждом нажатии клавиши.
 *
 * Использует SWR для кэширования и автоматической ревалидации данных.
 *
 * @module features/catalog/hooks/useDoctorSearch
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { useDoctors } from "./useDoctors"
import type { DoctorSearchParams } from "../../../entities/catalog/types/types"
import { DEFAULT_DOCTOR_SEARCH_PARAMS } from "../../../entities/catalog/model/constants"
import { useCatalogStore } from '@/entities/catalog/model/store'

const DEBOUNCE_DELAY = 500

export const useDoctorSearch = (initialParams?: DoctorSearchParams) => {
  const { doctorFilters } = useCatalogStore()

  const [searchParams, setSearchParams] = useState<DoctorSearchParams>(() => ({
    ...DEFAULT_DOCTOR_SEARCH_PARAMS,
    ...doctorFilters,
    ...initialParams,
  }))

  const [searchQuery, setSearchQuery] = useState(initialParams?.searchQuery || "")
  const debounceTimerRef = useRef<number | null>(null)

  // Используем SWR хук с текущими параметрами
  const { doctors, pagination, isLoading, error, mutate } = useDoctors(searchParams)

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const executeSearch = useCallback(
    (params: Partial<DoctorSearchParams>) => {
      const newParams: DoctorSearchParams = {
        ...DEFAULT_DOCTOR_SEARCH_PARAMS,
        ...doctorFilters,
        ...searchParams,
        ...params,
        page: params.page ?? 1, // Сбрасываем на первую страницу при новом поиске
      }

      setSearchParams(newParams)
      // SWR автоматически перезагрузит данные при изменении параметров
    },
    [doctorFilters, searchParams],
  )

  const updateSearchQuery = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        executeSearch({ searchQuery: newQuery, page: 1 })
      }, DEBOUNCE_DELAY)
    },
    [executeSearch],
  )

  const applyFilters = useCallback(
    (params: Partial<DoctorSearchParams>) => {
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
    executeSearch({ page: 1 })
  }, [executeSearch])

  return {
    // Данные из SWR
    doctors,
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
    refresh: mutate,
  }
}
