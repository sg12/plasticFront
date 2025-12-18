// src/shared/ui/card-button.tsx

import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "../lib/utils";
import type { VariantProps } from "class-variance-authority";

interface BannerButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  /**
   * Кастомные Tailwind-классы для разных частей карточки
   */
  colors?: {
    /** hover-бордер, например "hover:border-purple-500" */
    border?: string;
    /** hover-фон, например "hover:bg-purple-50" */
    bg?: string;
    /** фон иконки (обычный + hover), например "bg-purple-200 group-hover:bg-purple-300" */
    iconBg?: string;
    /** цвет иконки, например "text-purple-600" */
    icon?: string;
    /** цвет шеврона (обычный + hover), например "text-gray-400 group-hover:text-purple-600" */
    chevron?: string;
  };
}

const defaultColors = {
  border: "hover:border-gray-300",
  bg: "hover:bg-gray-50",
  iconBg: "bg-gray-200 group-hover:bg-gray-300",
  icon: "text-gray-600",
  chevron: "text-gray-400 group-hover:text-gray-600",
};

const BannerButton = React.forwardRef<HTMLButtonElement, BannerButtonProps>(
  (
    {
      title,
      description,
      icon: Icon,
      onClick,
      className,
      size = "bannerXl",
      colors = {},
      ...rest
    },
    ref,
  ) => {
    const {
      border = defaultColors.border,
      bg = defaultColors.bg,
      iconBg = defaultColors.iconBg,
      icon: iconColor = defaultColors.icon,
      chevron = defaultColors.chevron,
    } = colors;

    return (
      <Button
        ref={ref}
        variant="banner"
        size={size}
        onClick={onClick}
        type="button"
        className={cn("w-full group", border, bg, className)}
        {...rest}
      >
        <div className="flex items-center">
          <div
            className={cn(
              "rounded-xl flex items-center justify-center transition-colors",
              iconBg
            )}
          >
            <Icon className={cn(iconColor)} />
          </div>

          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>

          <ChevronRight
            className={cn(
              "transition-colors flex-shrink-0 text-gray-400",
              chevron
            )}
          />
        </div>
      </Button>
    );
  }
);

BannerButton.displayName = "BannerButton";

export { BannerButton };
