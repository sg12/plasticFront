import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/60",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        banner: "border-gray-200 border-2 text-left block text-md",
        save: "bg-green-600 text-white hover:bg-green-700",
        cancel: "bg-gray-200 text-muted-foreground hover:muted",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
        bannerSm:
          "p-4 [&>div]:gap-2 [&>div>div:first-child]:size-10 [&>div>div:first-child_svg]:size-5 [&_h3]:text-sm [&_p]:text-sm [&>div>svg]:size-5",
        bannerLg:
          "p-5 [&>div]:gap-4 [&>div>div:first-child]:size-12 [&>div>div:first-child_svg]:size-6 [&_h3]:text-lg [&_p]:text-sm [&>div>svg]:size-6",
        bannerXl:
          "p-6 [&>div]:gap-6 [&>div>div:first-child]:size-14 [&>div>div:first-child_svg]:size-7 [&_h3]:text-lg [&_p]:text-sm [&>div>svg]:size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
