/**
 * @fileoverview Кнопка добавления/удаления из избранного
 *
 * Компонент для управления избранным (врачи и клиники)
 *
 * @module features/favorites/ui/FavoriteButton
 */

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { useCatalogStore } from "@/entities/catalog/model/catalog.store"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import type { UserRole } from "@/entities/user/types/user.types"
import { Heart } from "lucide-react"

interface FavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  favoriteId: string
  type: UserRole
  isFavorite?: boolean
}

export const FavoriteButton = ({
  favoriteId,
  type,
  isFavorite: externalIsFavorite,
  className,
  ...props
}: FavoriteButtonProps) => {
  const { toggleFavorite, favoriteDoctors, favoriteClinics } = useCatalogStore()

  const internalIsFavorite =
    type === USER_ROLES.DOCTOR
      ? favoriteDoctors.includes(favoriteId)
      : favoriteClinics.includes(favoriteId)

  const isFavorite = externalIsFavorite !== undefined ? externalIsFavorite : internalIsFavorite

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(favoriteId, type)
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      size="iconMd"
      className={cn("shrink-0", className)}
      {...props}
    >
      <Heart
        className={cn(
          "transition-all",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500",
        )}
      />
    </Button>
  )
}
