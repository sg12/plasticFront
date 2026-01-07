import { useMatches } from "react-router"
import { Separator } from "@/shared/ui/separator"
import { SidebarTrigger } from "@/shared/ui/sidebar"

export const Header = () => {
  const matches = useMatches()
  const current = matches[matches.length - 1]
  const title =
    (current?.handle as { title?: string } | undefined)?.title ?? current?.pathname ?? ""

  return (
    <header className="bg-sidebar text-sidebar-foreground sticky top-0 right-0 left-0 z-1 flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2" />
      <div className="text-foreground min-w-0 truncate text-sm font-medium">{title}</div>
    </header>
  )
}
