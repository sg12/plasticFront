import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0070ff] text-[#FFFFFF] hover:bg-[#2b7fff] active:bg-[#0070ff] disabled:bg-[#DCE3EB]",
        secondary:
          "bg-[#EDF6FF] text-[#0070ff] hover:bg-[#E6F2FF] active:bg-[#EDF6FF] disabled:bg-[#F4F6FB] disabled:text-[#8293A2]",
        link: "bg-transparent text-[#468FFD] hover:text-[#0358D8] active:text-[#0358D8] visited:text-[#0358D8] disabled:text-[#8293A2]",
        ghost: "bg-transparent hover:bg-[#F1F4F9] disabled:bg-[#F1F4F9] disabled:text-[#8293A2]",
        success: "bg-[#55a630] text-[#FFFFFF] hover:bg-[#80b918] active:bg-[#55a630]",
        danger: "bg-[#FF4D3A] text-[#FFFFFF] hover:bg-[#E55934] active:bg-[#FF4D3A]",
      },
      size: {
        xs: "px-2.5 py-2 text-xs gap-1.5 [&_svg]:size-3",
        sm: "px-3 py-2.5 text-sm gap-2 [&_svg]:size-3.5",
        md: "px-4 py-3 text-base gap-2 [&_svg]:size-4",
        lg: "px-5 py-4 text-lg gap-2.5 [&_svg]:size-5",
        iconSm: "size-8 rounded-lg [&_svg]:size-4",
        iconMd: "size-11 rounded-lg [&_svg]:size-5",
        iconLg: "size-14 rounded-lg [&_svg]:size-6",

        bannerSm:
          "p-4 [&>div]:gap-2 [&>div>div:first-child]:size-10 [&>div>div:first-child_svg]:size-5 [&_h3]:text-sm [&_p]:text-sm [&>div>svg]:size-5",
        bannerLg:
          "p-5 [&>div]:gap-4 [&>div>div:first-child]:size-12 [&>div>div:first-child_svg]:size-6 [&_h3]:text-lg [&_p]:text-sm [&>div>svg]:size-6",
        bannerXl:
          "p-6 [&>div]:gap-6 [&>div>div:first-child]:size-14 [&>div>div:first-child_svg]:size-7 [&_h3]:text-lg [&_p]:text-sm [&>div>svg]:size-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type ?? "button"}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
