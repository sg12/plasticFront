import { Outlet } from "react-router"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import { Header } from "@/widgets/header/ui/Header"
import { NavigationSidebar } from "@/widgets/sidebars/navigationSidebar/ui/NavigationSidebar"

export const Main = () => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <NavigationSidebar />
          <SidebarInset>
            <div>
              <div className="mx-auto max-w-7xl p-4">
                <Outlet />
              </div>
            </div>
          </SidebarInset>
          {/* <ActionSidebar /> TODO: Добавить календарь ( 1) даты записи пациентов) */}
        </div>
      </SidebarProvider>
    </div>
  )
}
