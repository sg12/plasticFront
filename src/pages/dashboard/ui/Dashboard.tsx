import { useAuthStore } from "@/entities/auth/model/store"
import { formatName } from "@/shared/lib/utils"
import { Item, ItemTitle, ItemDescription, ItemContent } from "@/shared/ui/item"
import { Database, MessageCircle, Settings, User } from "lucide-react"
import { NavLink } from "react-router"

export const Dashboard = () => {
  const { profile } = useAuthStore()

  const quickMenu = [
    {
      icon: User,
      title: "Профиль",
      description: "Управляйте вашей личной информацией",
      to: "/main/profile",
    },
    {
      icon: Settings,
      title: "Настройки",
      description: "Общие настройки профиля",
      to: "/main/settings/general",
    },
    {
      icon: Database,
      title: "Персональные данные",
      description: "Управляйте персональными данными",
      to: "/main/settings/personalData",
    },
    {
      icon: MessageCircle,
      title: "Поддержка",
      description: "Связаться со службой поддержки",
      to: "/main/support",
    },
  ]

  return (
    <div className="space-global">
      <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="relative z-10 flex h-full flex-col justify-center p-8">
          <h1 className="text-white">
            Добро пожаловать, {formatName(profile?.fullName ?? "", false, "firstName")}!
          </h1>
          <p className="mt-2 text-purple-100">Управляйте своими записями и процедурами</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {quickMenu.map((item, index) => (
          <NavLink to={item.to} key={index}>
            <Item variant="muted" className="relative overflow-hidden">
              <item.icon className="pointer-events-none absolute right-3 size-24 opacity-10" />
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
            </Item>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
