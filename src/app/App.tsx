import { Outlet } from "react-router"
import { useEffect } from "react"
import { useAuthStore } from "@/entities/auth/model/auth.store"

export const App = () => {
  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  return <Outlet />
}
