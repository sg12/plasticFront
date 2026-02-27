import React from "react"
import { Link } from "react-router"
import { Separator } from "@/shared/ui/separator"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { useBreadcrumbs } from "@/shared/hooks/useBreadcrumbs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { Logo } from "@/shared/ui/logo"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { NotificationPopover } from "@/widgets/notification/NotificationPopover"
import { cn } from "@/shared/lib/utils"

export const Header = () => {
  const isMobile = useIsMobile()
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 right-0 left-0 z-1 flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger sidebarName="navigation" />
      <Separator orientation="vertical" className="mx-2" />
      <Logo variant="text" className={isMobile ? "m-auto" : ""} />
      {!isMobile && <Separator orientation="vertical" className="mx-2" />}

      {!isMobile && breadcrumbs.length > 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.path || index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage className="text-sm font-medium">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.path!} className="text-sm">
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {isMobile && <Separator orientation="vertical" className="mx-2" />}

      <div className={cn("relative", !isMobile ? "ml-auto" : "")}>
        {/* <NotificationPopover /> */}
      </div>
    </header>
  )
}
