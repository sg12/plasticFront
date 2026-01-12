import { useState } from "react"
import { toast } from "sonner"

/**
 * Хук для копирования текста в буфер обмена
 * @param text - Текст для копирования
 * @param options - Опции хука
 * @param options.successMessage - Сообщение при успешном копировании (по умолчанию "Скопировано в буфер обмена")
 * @param options.errorMessage - Сообщение при ошибке (по умолчанию "Не удалось скопировать")
 * @param options.showToast - Показывать ли toast уведомления (по умолчанию true)
 * @param options.resetDelay - Задержка в мс перед сбросом состояния copied (по умолчанию 2000)
 * @returns Объект с функцией copy и состоянием copied
 */
export const useClipboard = (
  text: string | null | undefined,
  options?: {
    successMessage?: string
    errorMessage?: string
    showToast?: boolean
    resetDelay?: number
  },
) => {
  const [copied, setCopied] = useState(false)

  const {
    successMessage = "Скопировано в буфер обмена",
    errorMessage = "Не удалось скопировать",
    showToast = true,
    resetDelay = 2000,
  } = options || {}

  const copy = async () => {
    if (!text) {
      if (showToast) {
        toast.error("Нет данных для копирования")
      }
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (showToast) {
        toast.success(successMessage)
      }
      setTimeout(() => setCopied(false), resetDelay)
    } catch (error) {
      if (showToast) {
        toast.error(errorMessage)
      }
      console.error("Ошибка при копировании в буфер обмена:", error)
    }
  }

  return { copy, copied }
}
