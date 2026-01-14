import { Outlet } from "react-router"
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar"
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar"
import { Header } from "@/widgets/header/ui/Header"

export const Main = () => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <SidebarInset>
            <div>
              <div className="mx-auto max-w-7xl p-4">
                <Outlet />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
