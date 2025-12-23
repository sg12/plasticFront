import { Outlet } from "react-router-dom"
import { useEffect, useCallback } from "react"
import { useAuthStore } from "@/entities/auth/model/store"

export const App = () => {
  const { initialize } = useAuthStore()

  const initAuth = useCallback(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return <Outlet />
}
