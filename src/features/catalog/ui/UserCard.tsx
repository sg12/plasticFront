/**
 * @fileoverview Универсальная карточка пользователя в каталоге
 *
 * Компонент отображает информацию о пользователе (врач, клиника или пациент)
 * в виде карточки. Поддерживает все типы профилей.
 *
 * @module features/catalog/ui/UserCard
 */

import { Heart, MapPin, Star, User, Hospital, Stethoscope } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { cn, formatName, pluralRu } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"
import { useCatalogStore } from "@/entities/catalog/model/store"
import { USER_ROLES } from "@/entities/user/model/constants"
import type { RoleProfile } from "@/entities/user/types/types"
import type { CatalogDoctor, CatalogClinic } from "@/entities/catalog/types/types"
import { differenceInDays } from "date-fns"

type UserCardProfile = CatalogDoctor | CatalogClinic | RoleProfile

interface UserCardProps {
  user: UserCardProfile
  className?: string
  showFavorite?: boolean
}

export const UserCard = ({ user, className, showFavorite = true }: UserCardProps) => {
  const { toggleFavorite, favoriteDoctors, favoriteClinics } = useCatalogStore()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Определяем тип для toggleFavorite
    if (user.role === USER_ROLES.DOCTOR) {
      toggleFavorite(user.id, "doctor")
    } else if (user.role === USER_ROLES.CLINIC) {
      toggleFavorite(user.id, "clinic")
    }
  }

  const favoriteDoctorsList = favoriteDoctors.find((doctor) => doctor === user.id)
  const favoriteClinicsList = favoriteClinics.find((clinic) => clinic === user.id)

  // Определяем, является ли пользователь избранным
  const isFavorite = favoriteDoctorsList || favoriteClinicsList

  // Получаем название для отображения
  const getDisplayName = () => {
    if (user.role === USER_ROLES.CLINIC) {
      const clinic = user as CatalogClinic
      return clinic.legalName || clinic.fullName || "Название не указано"
    }
    return user.fullName || "Имя не указано"
  }

  // Получаем иконку для аватара
  const getAvatarIcon = () => {
    switch (user.role) {
      case USER_ROLES.DOCTOR:
        return <Stethoscope className="size-6" />
      case USER_ROLES.CLINIC:
        return <Hospital className="size-6" />
      case USER_ROLES.PATIENT:
        return <User className="size-6" />
      default:
        return <User className="size-6" />
    }
  }

  // Получаем текст для аватара
  const getAvatarText = () => {
    if (user.role === USER_ROLES.CLINIC) {
      return null // Для клиники используем иконку
    }
    return formatName(user.fullName, true)
  }

  // Проверка, новый ли профиль
  const isNewProfile = user.createdAt && differenceInDays(new Date(), new Date(user.createdAt)) < 10

  // Получаем рейтинг (если есть)
  const getRating = () => {
    if ("averageRating" in user && user.averageRating !== undefined) {
      return user.averageRating
    }
    return undefined
  }

  const getReviewCount = () => {
    if ("reviewCount" in user && user.reviewCount !== undefined) {
      return user.reviewCount
    }
    return undefined
  }

  return (
    <Link
      to={`${ROUTES.PROFILE_SOME_USER.replace(":userId", user.id)}`}
      className={cn("block", className)}
    >
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
        <CardHeader className="flex items-start gap-4 lg:flex-row">
          <Avatar className="size-16 lg:size-24">
            <AvatarFallback className="text-lg">
              {getAvatarText() || getAvatarIcon()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3>{getDisplayName()}</h3>
            {user.role === USER_ROLES.DOCTOR && (
              <p className="text-muted-foreground">{(user as CatalogDoctor).specialization}</p>
            )}
            {user.role === USER_ROLES.CLINIC && (user as CatalogClinic).actualAddress && (
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {(user as CatalogClinic).actualAddress}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Бейджи и мета-информация */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {isNewProfile && <Badge variant="accent">Новый</Badge>}

            {user.role === USER_ROLES.DOCTOR && (
              <Badge variant="secondary">
                Опыт: {(user as CatalogDoctor).experience}{" "}
                {pluralRu((user as CatalogDoctor).experience, "год", "года", "лет")}
              </Badge>
            )}

            {user.role === USER_ROLES.CLINIC &&
              "doctorCount" in user &&
              user.doctorCount !== undefined && (
                <Badge variant="secondary">Врачей: {user.doctorCount}</Badge>
              )}

            {user.role === USER_ROLES.PATIENT && "birthDate" in user && user.birthDate && (
              <Badge variant="secondary">
                {new Date(user.birthDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            )}
          </div>

          {/* Рейтинг */}
          {getRating() !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{getRating()!.toFixed(1)}</span>
              {getReviewCount() !== undefined && (
                <span className="text-muted-foreground">
                  ({getReviewCount()} {getReviewCount() === 1 ? "отзыв" : "отзывов"})
                </span>
              )}
            </div>
          )}

          {/* Клиника/Место работы */}
          {user.role === USER_ROLES.DOCTOR && (
            <>
              {/* Приоритет: показываем клинику, если есть */}
              {(user as CatalogDoctor).clinicInfo ? (
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2">
                    Работает в: {(user as CatalogDoctor).clinicInfo?.legalName || "Клиника"}
                  </span>
                </div>
              ) : (user as CatalogDoctor).clinic ? (
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2">Работает в клинике</span>
                </div>
              ) : (
                // Если клиники нет, показываем workplace (если есть)
                (user as CatalogDoctor).workplace && (
                  <div className="text-muted-foreground flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span className="line-clamp-2">{(user as CatalogDoctor).workplace}</span>
                  </div>
                )
              )}
            </>
          )}

          {user.role === USER_ROLES.CLINIC && (user as CatalogClinic).actualAddress && (
            <div className="text-muted-foreground flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span className="line-clamp-2">{(user as CatalogClinic).actualAddress}</span>
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="justify-between pt-4">
          <Button variant="outline" className="w-max" asChild>
            <span>Подробнее</span>
          </Button>
          {showFavorite && (user.role === USER_ROLES.DOCTOR || user.role === USER_ROLES.CLINIC) && (
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
              <Heart
                className={cn(
                  "size-5 transition-colors",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-red-500",
                )}
              />
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
