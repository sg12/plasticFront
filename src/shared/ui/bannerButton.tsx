// src/shared/ui/card-button.tsx

import * as React from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { Button, buttonVariants } from "@/shared/ui/button"
import { cn } from "../lib/utils"
import type { VariantProps } from "class-variance-authority"

interface BannerButtonProps {
  title: string
  description?: string
  icon?: LucideIcon
  onClick?: () => void
  className?: string
  size?: VariantProps<typeof buttonVariants>["size"]
  /**
   * Кастомные Tailwind-классы для разных частей карточки
   */
  colors?: {
    /** hover-бордер, например "hover:border-purple-500" */
    border?: string
    /** hover-фон, например "hover:bg-purple-50" */
    bg?: string
    /** фон иконки (обычный + hover), например "bg-purple-200 group-hover:bg-purple-300" */
    iconBg?: string
    /** цвет иконки, например "text-purple-600" */
    icon?: string
    /** цвет шеврона (обычный + hover), например "text-gray-400 group-hover:text-purple-600" */
    chevron?: string
  }
}

const defaultColors = {
  border: "hover:border-gray-300",
  bg: "hover:bg-gray-50",
  iconBg: "bg-gray-200 group-hover:bg-gray-300",
  icon: "text-gray-600",
  chevron: "text-gray-400 group-hover:text-gray-600",
}

const BannerButton = React.forwardRef<HTMLButtonElement, BannerButtonProps>(
  (
    { title, description, icon: Icon, onClick, className, size = "bannerXl", colors = {}, ...rest },
    ref,
  ) => {
    const {
      border = defaultColors.border,
      bg = defaultColors.bg,
      iconBg = defaultColors.iconBg,
      icon: iconColor = defaultColors.icon,
      chevron = defaultColors.chevron,
    } = colors

    return (
      <Button
        ref={ref}
        variant="banner"
        size={size}
        onClick={onClick}
        type="button"
        className={cn("group w-full", border, bg, className)}
        {...rest}
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl transition-colors",
              "size-8 sm:size-10 md:size-12 lg:size-14",
              iconBg,
            )}
          >
            {Icon && <Icon className={cn(iconColor, "size-4 sm:size-5 md:size-6 lg:size-7")} />}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <h3
              className={cn(
                "font-bold text-gray-900",
                "text-sm sm:text-base md:text-lg",
                "truncate",
              )}
            >
              {title}
            </h3>
            {description && (
              <p
                className={cn(
                  "text-gray-600 max-xl:sr-only",
                  "text-xs sm:text-sm",
                  "line-clamp-2 sm:line-clamp-none",
                )}
              >
                {description}
              </p>
            )}
          </div>

          <ChevronRight
            className={cn(
              "flex-shrink-0 text-gray-400 transition-colors",
              "size-4 sm:size-5 md:size-6",
              chevron,
            )}
          />
        </div>
      </Button>
    )
  },
)

BannerButton.displayName = "BannerButton"

export { BannerButton }
