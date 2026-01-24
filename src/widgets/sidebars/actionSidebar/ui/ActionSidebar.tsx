import React from "react"
import {
  Sidebar,
  SidebarContent,
} from "@/shared/ui/sidebar"

export const ActionSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      name="action"
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      side="right"
      {...props}
    >
      <SidebarContent></SidebarContent>
    </Sidebar>
  )
}
