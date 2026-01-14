/**
 * @fileoverview Обобщенный хук для выполнения асинхронных действий
 *
 * Унифицирует обработку асинхронных операций с:
 * - Управлением состоянием загрузки
 * - Обработкой ошибок
 * - Toast уведомлениями
 * - Логированием
 * - Callback'ами успеха/ошибки
 *
 * @module shared/hooks/useAsyncAction
 */

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { logger } from "@/shared/lib/logger"

/**
 * Конфигурация для обобщенного хука асинхронного действия
 *
 * @template TParams - Тип параметров функции действия
 * @template TResult - Тип результата функции действия
 */
export interface AsyncActionConfig<TParams, TResult> {
  /** Асинхронная функция для выполнения */
  action: (params: TParams) => Promise<TResult>
  /** Сообщение об успехе (или функция для генерации сообщения) */
  successMessage?: string | ((result: TResult, params: TParams) => string)
  /** Сообщение об ошибке (или функция для генерации сообщения) */
  errorMessage?: string | ((error: Error, params: TParams) => string)
  /** Callback при успешном выполнении */
  onSuccess?: (result: TResult, params: TParams) => void | Promise<void>
  /** Callback при ошибке */
  onError?: (error: Error, params: TParams) => void | Promise<void>
  /** Функция валидации параметров (может выбросить ошибку) */
  validate?: (params: TParams) => TParams | void
  /** Контекст для логирования (например, { clinicId, doctorId }) */
  logContext?: (params: TParams) => Record<string, unknown>
  /** Название действия для логирования */
  logActionName?: string
  /** Показывать ли toast уведомления (по умолчанию true) */
  showToast?: boolean
}

/**
 * Результат работы хука useAsyncAction
 *
 * @template TParams - Тип параметров функции действия
 * @template TResult - Тип результата функции действия
 */
export interface UseAsyncActionReturn<TParams, TResult> {
  /** Функция для выполнения действия */
  execute: (params: TParams) => Promise<TResult | null>
  /** Состояние загрузки */
  isLoading: boolean
  /** Последняя ошибка (если была) */
  error: Error | null
}

/**
 * Обобщенный хук для выполнения асинхронных действий
 *
 * Унифицирует обработку асинхронных операций с управлением состоянием,
 * обработкой ошибок, уведомлениями и логированием.
 *
 * @template TParams - Тип параметров функции действия
 * @template TResult - Тип результата функции действия
 *
 * @param config - Конфигурация хука
 * @returns Объект с функцией выполнения, состоянием загрузки и ошибкой
 *
 * @example
 * ```typescript
 * const { execute, isLoading } = useAsyncAction({
 *   action: inviteDoctorToClinic,
 *   successMessage: "Приглашение отправлено врачу",
 *   errorMessage: "Не удалось отправить приглашение",
 *   onSuccess: () => refresh(),
 *   validate: (params) => {
 *     if (!clinicId) throw new Error("ID клиники не указан")
 *     return { clinicId, doctorId: params }
 *   },
 *   logActionName: "приглашение врача",
 * })
 * ```
 */
export const useAsyncAction = <TParams, TResult>(
  config: AsyncActionConfig<TParams, TResult>,
): UseAsyncActionReturn<TParams, TResult> => {
  const {
    action,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    validate,
    logContext,
    logActionName = "асинхронное действие",
    showToast = true,
  } = config

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (params: TParams): Promise<TResult | null> => {
      try {
        // Валидация параметров (если указана)
        let validatedParams = params
        if (validate) {
          const validationResult = validate(params)
          if (validationResult !== undefined) {
            validatedParams = validationResult as TParams
          }
        }

        setIsLoading(true)
        setError(null)

        // Выполнение действия
        const result = await action(validatedParams)

        // Успешное выполнение
        if (showToast && successMessage) {
          const message =
            typeof successMessage === "function"
              ? successMessage(result, validatedParams)
              : successMessage
          toast.success(message)
        }

        // Callback успеха
        if (onSuccess) {
          await onSuccess(result, validatedParams)
        }

        logger.info(`Успешное выполнение: ${logActionName}`, {
          ...(logContext ? logContext(validatedParams) : {}),
        })

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)

        // Сообщение об ошибке
        if (showToast) {
          const message =
            typeof errorMessage === "function"
              ? errorMessage(error, params)
              : errorMessage || error.message || "Произошла ошибка"
          toast.error(message)
        }

        // Логирование ошибки
        logger.error(`Ошибка выполнения: ${logActionName}`, error, {
          ...(logContext ? logContext(params) : {}),
        })

        // Callback ошибки
        if (onError) {
          await onError(error, params)
        }

        return null
      } finally {
        setIsLoading(false)
      }
    },
    [action, successMessage, errorMessage, onSuccess, onError, validate, logContext, logActionName, showToast],
  )

  return {
    execute,
    isLoading,
    error,
  }
}
