import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Dessert } from 'lucide-react';

const logoVariants = cva("inline-flex items-center gap-2", {
    variants: {
        variant: {
            full: "",      // Логотип + название
            icon: "",      // Только логотип
            text: "",      // Только название
        },
        size: {
            sm: "[&_svg]:size-6 text-lg",
            md: "[&_svg]:size-8 text-xl",
            lg: "[&_svg]:size-10 text-2xl",
        },
    },
    defaultVariants: {
        variant: "full",
        size: "md",
    },
});

interface LogoProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
    name?: string;
}

const LogoIcon = ({ className }: { className?: string }) => (
    <Dessert />
    // <svg
    //     className={className}
    //     viewBox="0 0 32 32"
    //     fill="none"
    //     xmlns="http://www.w3.org/2000/svg"
    // >
    //     {/* Замените на ваш SVG логотип */}
    //     <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
    //     <path
    //         d="M8 16C8 11.5817 11.5817 8 16 8V8C20.4183 8 24 11.5817 24 16V24H16C11.5817 24 8 20.4183 8 16V16Z"
    //         fill="white"
    //     />
    // </svg>
);

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
    ({ className, variant, size, name = "Novome", ...props }, ref) => {
        const showIcon = variant !== "text";
        const showText = variant !== "icon";

        return (
            <div
                ref={ref}
                className={cn(logoVariants({ variant, size }), className)}
                {...props}
            >
                {showIcon && <LogoIcon />}
                {showText && (
                    <span className="font-semibold tracking-tight">{name}</span>
                )}
            </div>
        );
    }
);

Logo.displayName = "Logo";

export { Logo, logoVariants, LogoIcon };

