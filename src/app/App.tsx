import { Outlet } from "react-router"
import { ConsentProvider } from "./providers/ConsentProvider"

export const App = () => {
  return (
    <ConsentProvider>
      <Outlet />
    </ConsentProvider>
  )
}
