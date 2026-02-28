/**
 * @fileoverview Универсальная карточка пользователя в каталоге
 *
 * Компонент отображает информацию о пользователе (врач, клиника или пациент)
 * в виде карточки. Поддерживает все типы профилей.
 *
 */

import { Link } from "react-router"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/shared/ui/card"
import { cn, formatName, pluralRu } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"
import { differenceInDays } from "date-fns"
import { FavoriteButton } from "@/features/data-processing/relationships/favorite-button/ui/FavoriteButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Hospital } from "lucide-react"
import type { Clinic, Doctor, Patient, ROLE } from "@/entities/user/types/user.types"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { SPECIALIZATION_LOCALES } from "@/entities/doctor/model/doctor.constants"
import { Badge } from "@/shared/ui/badge"


type BaseUser = Patient | Doctor | Clinic;

interface UserCardProps<T extends BaseUser> {
  user: T
  role: ROLE
  className?: string
  showFavorite?: boolean
}

export const UserCard = <T extends BaseUser>({ user, role, className, showFavorite = true }: UserCardProps<T>) => {
  const isNewProfile = user.createdAt && differenceInDays(new Date(), new Date(user.createdAt)) < 5

  const patient = role === USER_ROLE.PATIENT ? (user as Patient) : null;
  const doctor = role === USER_ROLE.DOCTOR ? (user as Doctor) : null;
  const clinic = role === USER_ROLE.CLINIC ? (user as Clinic) : null;

  const specialization = doctor?.specializations.map(
    (spec) => SPECIALIZATION_LOCALES[spec as keyof typeof SPECIALIZATION_LOCALES].ru
  ).join(", ")

  return (
    <Link
      to={`${ROUTES.PROFILE_SOME_USER.replace(":userId", user.user.id)}`}
      className={cn("block", className)}
    >
      <Card>
        <CardContent className="relative">
          <div className="flex items-start gap-4">
            <Avatar className="size-32 shrink-0 border">
              <AvatarImage src={user.user.avatar || undefined} />
              <AvatarFallback className="text-3xl">
                {user.user.role === USER_ROLE.CLINIC ? (
                  <Hospital className="size-10" />
                ) : (
                  formatName(user.user.fullName ?? "", true) || "—"
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="mb-1">{user.user.fullName}</CardTitle>
              <CardDescription>{specialization ? specialization : doctor ? "Нет специализаций" : ""}</CardDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {isNewProfile && <Badge variant="primary">Новый</Badge>}
                {doctor?.experience && <Badge variant="primary">Опыт: {pluralRu(doctor.experience, "год", "года", "лет")}</Badge>}
              </div>
            </div>
            {/* {showFavorite &&
              patient &&
            } */}
            <FavoriteButton favoriteId={user.user.id} />
          </div>
        </CardContent>

        {/* <CardFooter className="space-child grid">
          {user?.role === USER_ROLE.PATIENT &&
            <AppointmentButton
              doctorId={user.role === USER_ROLE.DOCTOR ? user.id : null}
              clinicId={user.role === USER_ROLE.CLINIC ? user.id : null}
            />
          }
          <Button variant="secondary" className="flex-1">
            Подробнее
          </Button>
        </CardFooter> */}
      </Card>
    </Link >
  )
}
