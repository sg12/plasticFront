import { useAuthStore } from "@/entities/auth/model/store"
import { formatName } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"
import { Item, ItemTitle, ItemDescription, ItemContent } from "@/shared/ui/item"
import { Database, MessageCircle, Settings, User, Search } from "lucide-react"
import { NavLink } from "react-router"

export const Dashboard = () => {
  const { profile } = useAuthStore()

  const quickMenu = [
    {
      icon: Search,
      title: "Каталог",
      description: "Найдите подходящего специалиста или клинику",
      to: ROUTES.CATALOG,
    },
    {
      icon: User,
      title: "Профиль",
      description: "Управляйте вашей личной информацией",
      to: ROUTES.PROFILE,
    },
    {
      icon: Settings,
      title: "Настройки",
      description: "Общие настройки профиля",
      to: ROUTES.GENERAL,
    },
    {
      icon: Database,
      title: "Персональные данные",
      description: "Управляйте персональными данными",
      to: ROUTES.PERSONAL_DATA,
    },
    {
      icon: MessageCircle,
      title: "Поддержка",
      description: "Связаться со службой поддержки",
      to: ROUTES.SUPPORT,
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
