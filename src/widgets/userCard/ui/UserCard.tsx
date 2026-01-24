/**
 * @fileoverview Универсальная карточка пользователя в каталоге
 *
 * Компонент отображает информацию о пользователе (врач, клиника или пациент)
 * в виде карточки. Поддерживает все типы профилей.
 *
 * @module features/catalog/ui/UserCard
 */

import { Link } from "react-router"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { cn, formatName, pluralRu } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"
import { USER_ROLES } from "@/entities/user/model/constants"
import type { RoleProfile } from "@/entities/user/types/types"
import type { CatalogDoctor, CatalogClinic } from "@/entities/catalog/types/types"
import { differenceInDays } from "date-fns"
import { useUserStore } from "@/entities/user/model/store"
import { AppointmentButton } from "@/features/appointments/ui/AppointmentButton"
import { FavoriteButton } from "@/features/favorites/ui/FavoriteButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Hospital } from "lucide-react"

type UserCardProfile = CatalogDoctor | CatalogClinic | RoleProfile

interface UserCardProps {
  user: UserCardProfile
  className?: string
  showFavorite?: boolean
}

export const UserCard = ({ user, className, showFavorite = true }: UserCardProps) => {
  const { profile } = useUserStore()

  // Получаем название для отображения
  const getDisplayName = () => {
    if (user.role === USER_ROLES.CLINIC) {
      const clinic = user as CatalogClinic
      return clinic.fullName || "Название не указано"
    }
    return user.fullName || "Имя не указано"
  }

  // Проверка, новый ли профиль
  const isNewProfile = user.createdAt && differenceInDays(new Date(), new Date(user.createdAt)) < 5

  const displayName = getDisplayName()
  const specialization =
    user.role === USER_ROLES.DOCTOR ? (user as CatalogDoctor).specialization?.trim() : null
  const experience =
    user.role === USER_ROLES.DOCTOR && (user as CatalogDoctor).experience
      ? pluralRu((user as CatalogDoctor).experience, "год", "года", "лет")
      : null

  return (
    <Link
      to={`${ROUTES.PROFILE_SOME_USER.replace(":userId", user.id)}`}
      className={cn("block", className)}
    >
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="relative">
          <div className="flex items-start gap-4">
            <Avatar className="size-32 shrink-0">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-3xl">
                {user.role === USER_ROLES.CLINIC ? (
                  <Hospital className="size-10" />
                ) : (
                  formatName(user.fullName ?? "", true) || "—"
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-1">{displayName}</CardTitle>
              {specialization && <CardDescription>{specialization}</CardDescription>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {isNewProfile && <Badge variant="primary">Новый</Badge>}
                {experience && <Badge variant="primary">Опыт: {experience}</Badge>}
              </div>
            </div>
            {showFavorite &&
              profile?.role === USER_ROLES.PATIENT &&
              (user.role === USER_ROLES.DOCTOR || user.role === USER_ROLES.CLINIC) && (
                <FavoriteButton favoriteId={user.id} type={user.role} />
              )}
          </div>
        </CardContent>

        <CardFooter className="space-child grid">
          {profile?.role === USER_ROLES.PATIENT &&
            (user.role === USER_ROLES.DOCTOR || user.role === USER_ROLES.CLINIC) && (
              <AppointmentButton
                doctorId={user.role === USER_ROLES.DOCTOR ? user.id : null}
                clinicId={user.role === USER_ROLES.CLINIC ? user.id : null}
              />
            )}
          <Button variant="secondary" className="flex-1">
            Подробнее
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
