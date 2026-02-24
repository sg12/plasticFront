import { NavLink, useLocation } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui/sidebar"
import { Item, ItemActions, ItemDescription, ItemTitle, ItemContent } from "@/shared/ui/item"
import { Button } from "@/shared/ui/button"
import { useAuthStore } from "@/entities/auth/model/auth.store"
import { formatName, formatRole } from "@/shared/lib/utils"
import { ChevronRight, Hospital, LogOut, Sparkles, Stethoscope, User } from "lucide-react"
import type { UserRole } from "@/entities/user/types/user.types"
import { navigationConfig, sectionLabels } from "../model/navigation"
import React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import { useUserStore } from "@/entities/user/model/user.store"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"

export const NavigationSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { signOut } = useAuthStore()
  const { profile } = useUserStore()
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar("navigation")

  const navigation = navigationConfig[profile?.role as UserRole] ?? []

  const activeId = (() => {
    for (const item of navigation) {
      if (pathname === item.url) return item.id
      if (item.items?.some((sub) => pathname === sub.url)) {
        const sub = item.items.find((s) => pathname === s.url)
        return sub?.id ?? item.id
      }
    }
    return null
  })()

  // Группируем элементы по section
  const groupedNavigation = navigation.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = []
      }
      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, typeof navigation>,
  )

  return (
    <Sidebar
      name="navigation"
      side="left"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent className="gap-1">
        {Object.entries(groupedNavigation).map(([section, items]) => (
          <React.Fragment key={section}>
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground/70 px-3 text-[10px] font-semibold tracking-wider">
                {sectionLabels[section] ?? section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const hasChildren = Boolean(item.items?.length)
                    const isSubActive = Boolean(item.items?.some((sub) => pathname === sub.url))
                    const isItemActive = activeId === item.id || isSubActive

                    if (!hasChildren) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isItemActive}
                            className={cn(
                              "relative transition-all duration-200",
                              isItemActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                            onClick={() => setOpenMobile(false)}
                          >
                            <NavLink to={item.url} className="relative flex items-center gap-3">
                              {isItemActive && (
                                <span className="bg-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full" />
                              )}
                              <item.icon
                                className={cn("size-4 shrink-0", isItemActive && "text-primary")}
                              />
                              <span className="truncate">{item.name}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }

                    return (
                      <Collapsible
                        key={item.id}
                        defaultOpen={isSubActive}
                        asChild
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isItemActive}
                              className={cn(
                                "relative transition-all duration-200",
                                isItemActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              {isItemActive && (
                                <span className="bg-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full" />
                              )}
                              <item.icon
                                className={cn("size-4 shrink-0", isItemActive && "text-primary")}
                              />
                              <span className="flex-1 truncate">{item.name}</span>
                              <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                            <SidebarMenuSub className="mt-1">
                              {item.items!.map((sub) => {
                                const isActive = activeId === sub.id || pathname === sub.url
                                return (
                                  <SidebarMenuSubItem key={sub.id}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isActive}
                                      className={cn(
                                        "relative transition-all duration-200",
                                        isActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                      )}
                                      onClick={() => setOpenMobile(false)}
                                    >
                                      <NavLink
                                        to={sub.url}
                                        className="relative flex items-center gap-3"
                                      >
                                        {isActive && (
                                          <span className="bg-primary absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full" />
                                        )}
                                        <sub.icon
                                          className={cn(
                                            "size-3.5 shrink-0",
                                            isActive && "text-primary",
                                          )}
                                        />
                                        <span className="truncate text-sm">{sub.name}</span>
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </React.Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t p-2">
        <Item
          asChild
          className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
        >
          <NavLink to="ai" onClick={() => setOpenMobile(false)} className="group">
            <Sparkles className="pointer-events-none absolute top-1/2 right-2 size-20 -translate-y-1/2 text-white/20" />
            <ItemContent className="relative z-10">
              <ItemTitle className="font-semibold text-white">
                Визуализатор <Badge variant="primary">Beta</Badge>
              </ItemTitle>
              <ItemDescription className="text-xs text-white/90">
                Посмотрите на себя после операции
              </ItemDescription>
            </ItemContent>
          </NavLink>
        </Item>
        <Item
          variant="muted"
          className="border-border/50 bg-card/50 hover:border-border hover:bg-card/80 relative overflow-hidden border backdrop-blur-sm transition-all duration-200"
        >
          {profile?.role === USER_ROLES.DOCTOR && (
            <Stethoscope className="text-muted-foreground/5 pointer-events-none absolute top-1/2 right-2 size-16 -translate-y-1/2" />
          )}
          {profile?.role === USER_ROLES.CLINIC && (
            <Hospital className="text-muted-foreground/5 pointer-events-none absolute top-1/2 right-2 size-16 -translate-y-1/2" />
          )}
          {profile?.role === USER_ROLES.PATIENT && (
            <User className="text-muted-foreground/5 pointer-events-none absolute top-1/2 right-2 size-16 -translate-y-1/2" />
          )}
          <ItemContent className="relative z-10">
            <ItemTitle className="text-foreground font-medium">
              {profile && profile.role === USER_ROLES.CLINIC
                ? profile.fullName
                : formatName(profile?.fullName || "-")}
            </ItemTitle>
            <ItemDescription className="text-muted-foreground text-xs">
              {formatRole(profile?.role as UserRole)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              onClick={() => signOut("local")}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 transition-colors"
            >
              <LogOut className="size-4" />
            </Button>
          </ItemActions>
        </Item>
      </SidebarFooter>
    </Sidebar>
  )
}
