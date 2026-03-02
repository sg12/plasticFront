import { formatName } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"
import { Card, CardContent } from "@/shared/ui/card"
import {
  Database,
  MessageCircle,
  Settings,
  User,
  Search,
  Users,
  Sparkles,
  Building2,
} from "lucide-react"
import { NavLink } from "react-router"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { useMe } from "@/entities/user/api/user.queries"

export const DashboardPage = () => {
  const { data: user } = useMe()
  const userRole = user?.role

  const getMainActions = () => {
    const baseActions = [
      {
        icon: Search,
        title: "Каталог",
        description: "Найдите подходящего специалиста или клинику",
        to: ROUTES.CATALOG,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        icon: User,
        title: "Профиль",
        description: "Управляйте вашей личной информацией",
        to: ROUTES.PROFILE,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    ]

    if (userRole === USER_ROLE.PATIENT) {
      return [
        ...baseActions,
        {
          icon: Sparkles,
          title: "AI Визуализатор",
          description: "Посмотрите на себя после операции",
          to: ROUTES.AIVISUALIZER,
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          borderColor: "border-violet-200",
        },
      ]
    }

    if (userRole === USER_ROLE.DOCTOR) {
      return [
        ...baseActions,
        {
          icon: Building2,
          title: "Мои клиники",
          description: "Управление клиниками, где вы работаете",
          to: ROUTES.DOCTOR_CLINICS,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        },
      ]
    }

    if (userRole === USER_ROLE.CLINIC) {
      return [
        ...baseActions,
        {
          icon: Users,
          title: "Врачи клиники",
          description: "Управление врачами в вашей клинике",
          to: ROUTES.CLINIC_DOCTORS,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
        },
      ]
    }

    return baseActions
  }

  // Дополнительные действия
  const additionalActions = [
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

  const mainActions = getMainActions()

  return (
    <div className="space-global">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="relative z-10 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Добро пожаловать, {formatName(user?.fullName ?? "", false, "firstName")}!
              </h1>
              <p className="mt-2 text-lg text-purple-100">
                {userRole === USER_ROLE.PATIENT && "Управляйте своими записями и процедурами"}
                {userRole === USER_ROLE.DOCTOR && "Управляйте расписанием и пациентами"}
                {userRole === USER_ROLE.CLINIC && "Управляйте клиникой и специалистами"}
                {!userRole && "Добро пожаловать в систему"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Основные действия</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainActions.map((action, index) => {
            const Icon = action.icon
            return (
              <NavLink to={action.to} key={index}>
                <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-xl ${action.bgColor} p-3 transition-transform group-hover:scale-110`}
                      >
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="group-hover:text-primary font-semibold">{action.title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </NavLink>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Дополнительно</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {additionalActions.map((action, index) => {
            const Icon = action.icon
            return (
              <NavLink to={action.to} key={index}>
                <Card className="group h-full transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                      <div className="flex-1">
                        <h3 className="group-hover:text-primary text-sm font-medium">
                          {action.title}
                        </h3>
                        <p className="text-muted-foreground mt-0.5 text-xs">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
