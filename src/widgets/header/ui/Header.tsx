import React from "react"
import { useMatches } from "react-router"
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

export const Header = () => {
  const matches = useMatches()
  const current = matches[matches.length - 1]
  const title =
    (current?.handle as { title?: string } | undefined)?.title ?? current?.pathname ?? ""

  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 right-0 left-0 z-1 flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2" />

      {breadcrumbs.length > 1 ? (
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
      ) : (
        <div className="text-foreground min-w-0 truncate text-sm font-medium">{title}</div>
      )}
    </header>
  )
}
