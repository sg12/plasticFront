import { Outlet } from "react-router-dom"
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar"
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar"
import { Header } from "@/widgets/header/ui/Header"

export const Main = () => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
