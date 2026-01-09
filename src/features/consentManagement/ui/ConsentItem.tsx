import { Button } from "@/shared/ui/button"
import { ShieldCheck, ShieldX } from "lucide-react"
import type { Consent } from "@/entities/consent/types/types"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CONSENT_TYPES } from "@/entities/consent/model/constants"

export interface ConsentItemProps {
  consent: Consent
  onRevoke: () => void
  onGrant: () => void
}

export const ConsentItem = ({ consent, onRevoke, onGrant }: ConsentItemProps) => {
  const isNecessary = ["medicalData", "personalData"].includes(consent.type)

  return (
    <div
      className={`flex items-start justify-between rounded-lg p-4 ${
        isNecessary ? "border border-purple-200 bg-purple-50" : "bg-gray-50"
      }`}
    >
      <div className="flex gap-3">
        <div className="mt-0.5">
          {consent.isActive ? (
            <ShieldCheck className="h-5 w-5 text-green-500" />
          ) : (
            <ShieldX className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{CONSENT_TYPES[consent.type].title}</p>
            <span
              className={`rounded px-2 py-0.5 text-xs ${
                consent.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {consent.isActive ? "Активно" : "Отозвано"}
            </span>
            {CONSENT_TYPES[consent.type].isRequired && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                Обязательное
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{CONSENT_TYPES[consent.type].description}</p>
          {consent.grantedAt && (
            <p className="mt-1 text-xs text-gray-500">
              {consent.isActive ? "Дата согласия: " : "Отозвано: "}
              {format(consent.revokedAt || consent.grantedAt, "dd MMMM yyyy г.", { locale: ru })}
            </p>
          )}
        </div>
      </div>

      <div className="ml-4">
        {consent.isActive ? (
          !consent.isRequired && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={onRevoke}
            >
              Отозвать
            </Button>
          )
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700"
            onClick={onGrant}
          >
            Восстановить
          </Button>
        )}
      </div>
    </div>
  )
}
