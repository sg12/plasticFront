import { LoaderIcon } from "lucide-react"

export function Loader({ message }: { message: string }) {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon className="text-primary size-10 animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
