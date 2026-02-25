/**
 * @fileoverview Компонент для защиты роутов по ролям пользователя
 *
 * @module app/routers/RoleProtectedRoute
 */

import { Navigate, Outlet, useMatches } from "react-router"
import { useUserStore } from "@/entities/user/model/user.store"
import { ROUTES } from "@/shared/model/routes"
import { Loader } from "@/shared/ui/loader"
import type { ROLE } from "@/entities/user/types/user.types"

interface RouteHandle {
  allowedRoles?: ROLE[]
  redirectTo?: string
}

/**
 * Компонент для защиты роутов по ролям пользователя
 *
 * Роли для проверки берутся из `handle` текущего роута.
 * В Router.tsx нужно указать `handle: { allowedRoles: [ROLE.DOCTOR] }`
 *
 * @example
 * ```tsx
 * // В Router.tsx:
 * {
 *   ...lazyRoute(() => import("@/app/routers/RoleProtectedRoute"), "RoleProtectedRoute"),
 *   handle: {
 *     allowedRoles: [ROLE.DOCTOR],
 *   },
 *   children: [
 *     {
 *       path: ROUTES.DOCTOR_SCHEDULE,
 *       ...lazyRoute(() => import("@/pages/doctorSchedule/ui/DoctorSchedule"), "DoctorSchedule"),
 *     },
 *   ],
 * }
 * ```
 */
export const RoleProtectedRoute = () => {
  const { profile, isLoading } = useUserStore()
  const matches = useMatches()

  let handle: RouteHandle | undefined

  for (let i = matches.length - 2; i >= 0; i--) {
    const match = matches[i]
    const matchHandle = match?.handle as RouteHandle | undefined
    if (
      matchHandle?.allowedRoles &&
      Array.isArray(matchHandle.allowedRoles) &&
      matchHandle.allowedRoles.length > 0
    ) {
      handle = matchHandle
      break
    }
  }

  const allowedRoles = handle?.allowedRoles || []
  const redirectTo = handle?.redirectTo || ROUTES.MAIN

  if (!handle || !handle.allowedRoles || handle.allowedRoles.length === 0) {
    console.error(
      "RoleProtectedRoute: allowedRoles не найдены в handle роута. Доступ заблокирован.",
    )
  }

  if (isLoading) {
    return <Loader message="Проверка доступа..." />
  }

  if (!profile) {
    return <Navigate to={ROUTES.SIGNIN} replace />
  }

  if (allowedRoles.length === 0) {
    console.warn("RoleProtectedRoute: allowedRoles не указаны, доступ заблокирован")
    return <Navigate to={redirectTo} replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
