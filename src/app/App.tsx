import { Outlet } from "react-router"
import { useEffect } from "react"
import { useAuthStore } from "@/entities/auth/model/store"

export const App = () => {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <Outlet />
}
