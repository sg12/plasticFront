import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/shared/ui/sidebar"
import { Item, ItemActions, ItemDescription, ItemTitle, ItemContent } from "@/shared/ui/item"
import { Button } from "@/shared/ui/button"
import { useAuthStore } from "@/entities/auth/model/store"
import { formatName, formatRole } from "@/shared/lib/utils"
import { ChevronRight, Hospital, LogOut, Sparkles, Stethoscope, User } from "lucide-react"
import type { UserRole } from "@/entities/user/types/types"
import { navigationConfig, sectionLabels } from "../model/navigation"
import { Logo } from "../../../shared/ui/logo"
import type React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"

export const Sidebar = ({ ...props }: React.ComponentProps<typeof SidebarUI>) => {
  const { user, profile, signOut } = useAuthStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/signin", { replace: true })
  }

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
    <SidebarUI collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        {Object.entries(groupedNavigation).map(([section, items]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel>{sectionLabels[section] ?? section}</SidebarGroupLabel>
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
                          className={
                            isItemActive
                              ? "bg-purple-50 text-purple-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }
                        >
                          <NavLink to={item.url}>
                            <item.icon />
                            <span>{item.name}</span>
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
                        <CollapsibleTrigger asChild className="font-normal">
                          <SidebarMenuButton
                            className={
                              isItemActive
                                ? "bg-purple-50 text-purple-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }
                          >
                            <item.icon />
                            <span>{item.name}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items!.map((sub) => {
                              const isActive = activeId === sub.id || pathname === sub.url
                              return (
                                <SidebarMenuSubItem key={sub.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={
                                      isActive
                                        ? "bg-purple-50 text-purple-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }
                                  >
                                    <NavLink to={sub.url}>
                                      <sub.icon />
                                      <span>{sub.name}</span>
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Item
          asChild
          className="relative overflow-hidden border-0 bg-linear-to-r from-violet-500 to-fuchsia-700 text-white hover:scale-[1.02]"
        >
          <NavLink to="ai">
            <Sparkles className="pointer-events-none absolute -right-3 size-24 text-white/90 opacity-40" />
            <ItemContent>
              <ItemTitle className="font-semibold text-white">AI Визуализатор</ItemTitle>
              <ItemDescription className="text-white/80">
                Он покажет, как ты будешь выглядеть после операции
              </ItemDescription>
            </ItemContent>
          </NavLink>
        </Item>
        <Item variant="muted" className="relative overflow-hidden">
          {profile?.role === "doctor" && (
            <Stethoscope className="pointer-events-none absolute -right-3 size-24 opacity-10" />
          )}
          {profile?.role === "clinic" && (
            <Hospital className="pointer-events-none absolute right-3 size-24 opacity-10" />
          )}
          {profile?.role === "patient" && (
            <User className="pointer-events-none absolute right-3 size-24 opacity-10" />
          )}
          <ItemContent>
            <ItemTitle>{formatName(user?.user_metadata.full_name)}</ItemTitle>
            <ItemDescription>{formatRole(profile?.role as UserRole)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button type="button" variant="ghost" size="icon" onClick={() => void handleSignOut()}>
              <LogOut />
            </Button>
          </ItemActions>
        </Item>
      </SidebarFooter>
    </SidebarUI>
  )
}
