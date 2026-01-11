/**
 * @fileoverview Хук для генерации breadcrumbs на основе маршрутов
 *
 * Использует useMatches() из React Router для получения всех совпавших маршрутов
 * и преобразует их в структуру breadcrumbs.
 *
 * @module shared/hooks/useBreadcrumbs
 */

import { useMatches, useLocation } from "react-router"
import { useMemo } from "react"
import { ROUTES } from "@/shared/model/routes"

/**
 * Элемент breadcrumb
 */
export interface BreadcrumbItem {
  /** Текст для отображения */
  label: string
  /** Путь для ссылки (null для текущей страницы) */
  path: string | null
  /** Является ли это текущей страницей */
  isActive: boolean
}

/**
 * Хук для получения breadcrumbs на основе текущего маршрута
 *
 * Использует useMatches() для получения всех совпавших маршрутов в иерархии,
 * фильтрует их и преобразует в структуру breadcrumbs.
 *
 * @returns Массив элементов breadcrumbs
 */
export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const matches = useMatches()
  const location = useLocation()

  return useMemo(() => {
    // Фильтруем маршруты: берем только те, у которых есть handle с title
    // или которые не являются root маршрутами
    const breadcrumbMatches = matches.filter((match) => {
      // Пропускаем корневой маршрут "/"
      if (match.pathname === "/") return false

      // Пропускаем маршруты без handle или без title
      const handle = match.handle as { title?: string } | undefined
      if (!handle?.title) return false

      return true
    })

    // Преобразуем matches в breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = breadcrumbMatches.map((match, index) => {
      const handle = match.handle as { title?: string } | undefined
      const isLast = index === breadcrumbMatches.length - 1

      // match.pathname уже содержит реальный путь с подставленными параметрами
      const path = match.pathname

      return {
        label: handle?.title || match.pathname,
        path: isLast ? null : path, // Последний элемент не является ссылкой
        isActive: isLast,
      }
    })

    // Всегда добавляем "Главная" в начало, если мы не на главной
    if (breadcrumbs.length > 0 && location.pathname !== ROUTES.MAIN) {
      // Проверяем, есть ли уже "Главная" в breadcrumbs
      const hasMain = breadcrumbs.some((b) => b.path === ROUTES.MAIN)

      if (!hasMain) {
        breadcrumbs.unshift({
          label: "Главная",
          path: ROUTES.MAIN,
          isActive: false,
        })
      }
    }

    return breadcrumbs
  }, [matches, location.pathname])
}
