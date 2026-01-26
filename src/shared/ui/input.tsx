import * as React from "react"

import { cn } from "../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input bg-input-background flex min-h-9 w-full min-w-0 rounded-xl border px-4 py-3 text-base transition-[color,box-shadow] outline-none file:mr-4 file:inline-flex file:h-7 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:text-sm file:font-medium file:text-purple-700 hover:file:bg-purple-100 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input }