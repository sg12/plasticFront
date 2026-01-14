/**
 * @fileoverview Универсальная карточка пользователя в каталоге
 *
 * Компонент отображает информацию о пользователе (врач, клиника или пациент)
 * в виде карточки. Поддерживает все типы профилей.
 *
 * @module features/catalog/ui/UserCard
 */

import { Heart, MapPin, Star, User, Hospital, Stethoscope, Phone } from "lucide-react"
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
      return clinic.fullName || "Название не указано"
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
      return null
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

  const displayName = getDisplayName()
  const specialization =
    user.role === USER_ROLES.DOCTOR ? (user as CatalogDoctor).specialization?.trim() : null
  const rating = getRating()
  const reviewCount = getReviewCount()
  const experience =
    user.role === USER_ROLES.DOCTOR && (user as CatalogDoctor).experience
      ? pluralRu((user as CatalogDoctor).experience, "год", "года", "лет")
      : null

  // Данные для клиники
  const clinicData =
    user.role === USER_ROLES.CLINIC
      ? {
          legalName: (user as CatalogClinic).legalName?.trim() || null,
          actualAddress: (user as CatalogClinic).actualAddress?.trim() || null,
          legalAddress: (user as CatalogClinic).legalAddress?.trim() || null,
          phone: user.phone?.trim() || null,
          email: user.email?.trim() || null,
        }
      : null

  return (
    <Link
      to={`${ROUTES.PROFILE_SOME_USER.replace(":userId", user.id)}`}
      className={cn("block", className)}
    >
      <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="size-16 shrink-0 lg:size-20">
            <AvatarFallback className="text-base lg:text-lg">
              {getAvatarText() || getAvatarIcon()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="group-hover:text-primary line-clamp-2 font-semibold transition-colors">
                  {displayName}
                </h3>
                {specialization && (
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {specialization}
                  </p>
                )}
                {user.role === USER_ROLES.CLINIC &&
                  clinicData?.legalName &&
                  clinicData.legalName !== displayName && (
                    <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                      {clinicData.legalName}
                    </p>
                  )}
              </div>
              {showFavorite && user.role === USER_ROLES.PATIENT && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleFavoriteClick}
                  aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                >
                  <Heart
                    className={cn(
                      "size-4 transition-all",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground group-hover:text-red-500",
                    )}
                  />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Рейтинг и бейджи */}
          <div className="flex flex-col gap-3">
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                </div>
                {reviewCount !== undefined && (
                  <span className="text-muted-foreground text-sm">
                    {reviewCount}{" "}
                    {reviewCount === 1 ? "отзыв" : reviewCount < 5 ? "отзыва" : "отзывов"}
                  </span>
                )}
              </div>
            )}

            {/* Бейджи */}
            {(isNewProfile ||
              experience ||
              (user.role === USER_ROLES.CLINIC && "doctorCount" in user && user.doctorCount)) && (
              <div className="flex flex-wrap items-center gap-2">
                {isNewProfile && <Badge variant="accent">Новый</Badge>}
                {experience && (
                  <Badge variant="secondary" className="text-xs">
                    Опыт: {experience}
                  </Badge>
                )}
                {user.role === USER_ROLES.CLINIC &&
                  "doctorCount" in user &&
                  user.doctorCount !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      Врачей: {user.doctorCount}
                    </Badge>
                  )}
              </div>
            )}
          </div>

          {/* Клиника/Место работы */}
          {user.role === USER_ROLES.DOCTOR && (
            <>
              {(user as CatalogDoctor).clinicInfo?.legalName ? (
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2">
                    {(user as CatalogDoctor).clinicInfo?.legalName || ""}
                  </span>
                </div>
              ) : (user as CatalogDoctor).workplace?.trim() ? (
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2">
                    {(user as CatalogDoctor).workplace?.trim() || ""}
                  </span>
                </div>
              ) : null}
            </>
          )}

          {/* Информация о клинике */}
          {user.role === USER_ROLES.CLINIC && clinicData && (
            <div className="space-y-2">
              {clinicData.actualAddress && (
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="line-clamp-2">{clinicData.actualAddress}</span>
                </div>
              )}
              {clinicData.phone && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="size-4 shrink-0" />
                  <span className="line-clamp-1">{clinicData.phone}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <span>Подробнее</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
