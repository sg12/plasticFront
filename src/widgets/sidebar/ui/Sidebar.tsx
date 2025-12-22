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
} from "@/shared/ui/sidebar"
import { Item, ItemActions, ItemDescription, ItemTitle, ItemContent } from "@/shared/ui/item"
import { Button } from "@/shared/ui/button"
import { useAuthStore } from "@/entities/auth/model/store"
import { formatName, formatRole } from "@/shared/lib/utils"
import { Hospital, LogOut, Sparkles, Stethoscope, User } from "lucide-react"
import type { UserRole } from "@/entities/user/types/types"
import { navigationConfig, sectionLabels } from "../model/navigation"
import { Logo } from "../../../shared/ui/logo"
import type React from "react"
import { Skeleton } from "../../../shared/ui/skeleton"

export const Sidebar = ({ ...props }: React.ComponentProps<typeof SidebarUI>) => {
  const { user, profile, signOut } = useAuthStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/signin", { replace: true })
  }

  const navigation = navigationConfig[profile?.role as UserRole] ?? []
  const activeItem = navigation.find((item) => pathname === item.url)

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
                {items.map((item) =>
                  !navigation ? (
                    <>
                      <Skeleton className="h-10 w-[224px]" />
                    </>
                  ) : (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        className={
                          activeItem?.id === item.id
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
                  ),
                )}
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
