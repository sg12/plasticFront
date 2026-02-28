/**
 * @fileoverview Кнопка добавления/удаления из избранного
 *
 * Компонент для управления избранным (врачи и клиники)
 *
 * @module features/favorites/ui/FavoriteButton
 */

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { Heart } from "lucide-react"
import { useAddToFavorite, useMe } from "@/entities/user/api/user.queries"

interface FavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  favoriteId: string
}

export const FavoriteButton = ({
  favoriteId,
  className,
  ...props
}: FavoriteButtonProps) => {
  const { data: user } = useMe()
  const { mutateAsync: addToFavorite, isPending, isSuccess, isIdle } = useAddToFavorite();

  const isFavorite = user?.patient.favorites?.find((favorite) => favorite.clinicId || favorite.doctorId === favoriteId)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToFavorite(favoriteId);
  }

  return (
    <Button
      variant="ghost"
      onClick={handleFavoriteClick}
      size="iconMd"
      disabled={isPending}
      className={cn("shrink-0", className)}
      {...props}
    >
      <Heart
        className={cn(
          "transition-all size-4",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500",
        )}
      />
    </Button>
  )
}
