import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  iconSize?: number
  iconClassName?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  iconSize = 48,
  iconClassName = "text-gray-400",
}: EmptyStateProps) => {
  return (
    <div className="py-8 text-center">
      <Icon className={`mx-auto mb-4 h-12 w-12 ${iconClassName}`} size={iconSize} />
      <p className="text-muted-foreground">{title}</p>
      {description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
