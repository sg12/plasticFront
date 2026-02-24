import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { ShieldCheck, ShieldX } from "lucide-react"
import type { Consent } from "@/entities/consent/types/consent.types"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CONSENT_TYPES } from "@/entities/consent/model/consent.constants"

export interface ConsentItemProps {
  consent: Consent
  onRevoke: () => void
  onGrant: () => void
}

export const ConsentItem = ({ consent, onRevoke, onGrant }: ConsentItemProps) => {
  const isNecessary = ["medicalData", "personalData"].includes(consent.type)
  const consentType = CONSENT_TYPES[consent.type]

  return (
    <div
      className={`flex items-start justify-between rounded-lg border p-4 transition-colors ${isNecessary
        ? "border-purple-200 bg-purple-50/50 hover:bg-purple-50"
        : "bg-muted/30 hover:bg-muted/50"
        }`}
    >
      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 shrink-0">
          {consent.isActive ? (
            <ShieldCheck className="h-5 w-5 text-green-600" />
          ) : (
            <ShieldX className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="font-semibold">{consentType.title}</p>
            <Badge variant={consent.isActive ? "accent" : "destructive"} className="text-xs">
              {consent.isActive ? "Активно" : "Отозвано"}
            </Badge>
            {consentType.isRequired && (
              <Badge variant="secondary" className="text-xs">
                Обязательное
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{consentType.description}</p>
          {consent.grantedAt && (
            <p className="text-muted-foreground mt-2 text-xs">
              {consent.isActive ? "Дата согласия: " : "Отозвано: "}
              {format(consent.revokedAt || consent.grantedAt, "dd MMMM yyyy г.", { locale: ru })}
            </p>
          )}
        </div>
      </div>

      <div className="ml-4 shrink-0">
        {consent.isActive ? (
          !consent.isRequired && (
            <Button variant="ghost" size="sm" onClick={onRevoke}>
              Отозвать
            </Button>
          )
        ) : (
          <Button variant="ghost" size="sm" onClick={onGrant}>
            Восстановить
          </Button>
        )}
      </div>
    </div>
  )
}
