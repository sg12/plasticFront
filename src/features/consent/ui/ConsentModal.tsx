import { ExternalLink, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { useConsents } from "@/entities/consent/api/consent.queries"
import { Item, ItemContent } from "@/shared/ui/item"
import { Switch } from "@/shared/ui/switch"
import { useNavigate } from "react-router"
import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { ROUTES } from "@/shared/model/routes"

interface Props {
  onAccept: (ids: string[]) => void
  onDecline: () => void
}

export function ConsentModal({ onAccept, onDecline }: Props) {
  const { data: consents, isLoading } = useConsents()
  const navigate = useNavigate()

  const [selectedOptionalIds, setSelectedOptionalIds] = useState<string[]>([])

  const toggleConsent = (id: string) => {
    setSelectedOptionalIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleAcceptAll = () => {
    const requiredIds = consents?.filter(consent => consent.isRequired).map(consent => consent.id) || []
    onAccept([...requiredIds, ...selectedOptionalIds])
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDecline()}>
      <DialogContent>
        <DialogHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Юридические документы</DialogTitle>
              <DialogDescription>
                Для продолжения необходимо принять обязательные политики
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin mr-2" />
              <span>Загрузка...</span>
            </div>
          ) : (
            <div className="grid gap-3">
              {consents?.map((consent) => {
                const isRequired = consent.isRequired
                const isSelected = isRequired || selectedOptionalIds.includes(consent.id)

                return (
                  <Item
                    key={consent.id}
                    variant="outline"
                    className={cn(
                      "transition-all duration-200 group",
                      isSelected ? "border-purple-200 bg-purple-50/30" : "opacity-80"
                    )}
                  >
                    <ItemContent>
                      <div
                        className="flex-1 cursor-pointer pr-4"
                        onClick={() => navigate(ROUTES.POLICIES.replace(':id', consent.id))}
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm sm:text-base group-hover:text-purple-600 transition-colors">
                            {consent.title}
                          </h4>
                          <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRequired ? "Обязательно для регистрации" : "По желанию"}
                        </p>
                      </div>

                    </ItemContent>

                    {!isRequired && (
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => toggleConsent(consent.id)}
                      />
                    )}
                  </Item>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleAcceptAll}>
            Принять и продолжить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}