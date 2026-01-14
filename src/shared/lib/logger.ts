/**
 * Централизованная система логирования
 *
 * Предоставляет единый интерфейс для логирования ошибок, предупреждений и информационных сообщений
 * с автоматическим сбором контекста и возможностью интеграции с сервисами мониторинга
 */

type LogLevel = "error" | "warn" | "info" | "debug"

interface LogContext {
  userId?: string
  userRole?: string
  route?: string
  timestamp: string
  userAgent?: string
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  error?: Error
  context?: LogContext
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private isProduction = import.meta.env.PROD

  /**
   * Собирает контекстную информацию для лога
   */
  private getContext(): LogContext {
    const context: LogContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      route: window.location.pathname,
    }

    // Добавляем информацию о пользователе, если доступна
    // Используем динамический импорт для избежания циклических зависимостей
    try {
      // Проверяем наличие store через window или глобальную переменную
      // В production можно добавить более надежный способ получения контекста
      if (
        typeof window !== "undefined" &&
        (window as unknown as { __authStore?: unknown }).__authStore
      ) {
        // Контекст будет добавлен при инициализации
      }
    } catch {
      // Игнорируем ошибки при получении контекста
    }

    return context
  }

  /**
   * Форматирует сообщение для консоли
   */
  private formatConsoleMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.level.toUpperCase()}]`,
      entry.message,
      entry.context?.route ? `Route: ${entry.context.route}` : "",
      entry.context?.userId ? `User: ${entry.context.userId}` : "",
    ].filter(Boolean)

    return parts.join(" | ")
  }

  /**
   * Отправляет лог во внешний сервис мониторинга (Sentry, LogRocket и т.д.)
   */
  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    if (!this.isProduction) {
      return // В development не отправляем
    }

    try {
      // Пример интеграции с Sentry (раскомментируйте при установке @sentry/react)
      // if (entry.level === 'error' && entry.error) {
      //   Sentry.captureException(entry.error, {
      //     contexts: {
      //       custom: entry.context,
      //     },
      //     extra: entry.metadata,
      //   })
      // }
      // Пример отправки на ваш API
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
    } catch (error) {
      // Не логируем ошибки логирования, чтобы избежать бесконечного цикла
      console.error("Failed to send log to monitoring:", error)
    }
  }

  /**
   * Основной метод логирования
   */
  private async log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const context = this.getContext()
    const entry: LogEntry = {
      level,
      message,
      error,
      context,
      metadata,
    }

    // Логирование в консоль
    if (this.isDevelopment) {
      const consoleMessage = this.formatConsoleMessage(entry)

      switch (level) {
        case "error":
          console.error(consoleMessage, error || "", {
            context: entry.context,
            metadata: entry.metadata,
          })
          break
        case "warn":
          console.warn(consoleMessage, { context: entry.context, metadata: entry.metadata })
          break
        case "info":
          console.info(consoleMessage, { context: entry.context, metadata: entry.metadata })
          break
        case "debug":
          console.debug(consoleMessage, { context: entry.context, metadata: entry.metadata })
          break
      }
    }

    // Отправка в production мониторинг
    if (this.isProduction && (level === "error" || level === "warn")) {
      await this.sendToMonitoring(entry)
    }
  }

  /**
   * Логирование ошибок
   */
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log("error", message, error, metadata).catch(() => {
      // Игнорируем ошибки логирования
    })
  }

  /**
   * Логирование предупреждений
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, undefined, metadata).catch(() => {})
  }

  /**
   * Логирование информационных сообщений
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, undefined, metadata).catch(() => {})
  }

  /**
   * Логирование отладочной информации (только в development)
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log("debug", message, undefined, metadata).catch(() => {})
    }
  }
}

// Экспортируем singleton экземпляр
export const logger = new Logger()

// Экспортируем типы для использования в других модулях
export type { LogLevel, LogContext, LogEntry }
