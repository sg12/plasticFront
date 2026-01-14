/**
 * @fileoverview Обобщенный хук для загрузки списков сущностей
 *
 * Унифицирует логику загрузки списков с:
 * - Управлением состоянием загрузки
 * - Обработкой ошибок
 * - Автоматической загрузкой при изменении параметров
 * - Функцией обновления
 *
 * @module shared/hooks/useEntityList
 */

import { useEffect, useState, useCallback } from "react"
import { logger } from "@/shared/lib/logger"

/**
 * Конфигурация для обобщенного хука загрузки списка
 *
 * @template TEntity - Тип элементов списка
 * @template TId - Тип идентификатора (обычно string)
 */
export interface EntityListConfig<TEntity, TId = string> {
  /** Функция для загрузки списка */
  fetchFn: (id: TId) => Promise<TEntity[]>
  /** ID для загрузки (может быть undefined) */
  id: TId | undefined
  /** Сообщение об ошибке по умолчанию */
  errorMessage?: string
  /** Название сущности для логирования */
  entityName?: string
  /** Контекст для логирования (например, { clinicId }) */
  logContext?: (id: TId) => Record<string, unknown>
  /** Автоматически загружать при изменении id (по умолчанию true) */
  autoLoad?: boolean
}

/**
 * Результат работы хука useEntityList
 *
 * @template TEntity - Тип элементов списка
 */
export interface UseEntityListReturn<TEntity> {
  /** Данные (массив элементов) */
  data: TEntity[]
  /** Состояние загрузки */
  isLoading: boolean
  /** Ошибка загрузки */
  error: string | null
  /** Функция для ручного обновления списка */
  refresh: () => Promise<void>
}

/**
 * Обобщенный хук для загрузки списков сущностей
 *
 * Унифицирует логику загрузки списков с управлением состоянием,
 * обработкой ошибок и автоматической загрузкой при изменении параметров.
 *
 * @template TEntity - Тип элементов списка
 * @template TId - Тип идентификатора (обычно string)
 *
 * @param config - Конфигурация хука
 * @returns Объект с данными, состоянием загрузки, ошибкой и функцией обновления
 *
 * @example
 * ```typescript
 * const { data: doctors, isLoading, error, refresh } = useEntityList({
 *   fetchFn: getClinicDoctors,
 *   id: clinicId,
 *   errorMessage: "Не удалось загрузить список врачей",
 *   entityName: "врачи клиники",
 *   logContext: (id) => ({ clinicId: id }),
 * })
 * ```
 */
export const useEntityList = <TEntity, TId = string>(
  config: EntityListConfig<TEntity, TId>,
): UseEntityListReturn<TEntity> => {
  const {
    fetchFn,
    id,
    errorMessage = "Не удалось загрузить список",
    entityName = "сущности",
    logContext,
    autoLoad = true,
  } = config

  const [data, setData] = useState<TEntity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!id) {
      setData([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn(id)
      setData(result)
      logger.debug(`Список ${entityName} успешно загружен`, {
        ...(logContext ? logContext(id) : { id }),
        count: result.length,
      })
    } catch (err) {
      const errorMessageFinal =
        err instanceof Error ? err.message : errorMessage
      setError(errorMessageFinal)
      logger.error(`Ошибка загрузки ${entityName}`, err instanceof Error ? err : new Error(String(err)), {
        ...(logContext ? logContext(id) : { id }),
      })
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, id, errorMessage, entityName, logContext])

  useEffect(() => {
    if (autoLoad) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, autoLoad])

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  }
}
