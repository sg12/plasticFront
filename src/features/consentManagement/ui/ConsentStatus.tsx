import { Skeleton } from "@/shared/ui/skeleton"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { ShieldCheck, ShieldX, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useConsentManagement } from "../hooks/useConsentManagement"
import type { Consent } from "../types/types"

export const ConsentStatus = () => {
  const { consents, isLoading, revokeConsent, grantConsent } = useConsentManagement()
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null)

  const handleRevokeClick = (consent: Consent) => {
    setSelectedConsent(consent)
    setRevokeDialogOpen(true)
  }

  const confirmRevoke = () => {
    if (selectedConsent) {
      revokeConsent(selectedConsent.type)
    }
    setRevokeDialogOpen(false)
    setSelectedConsent(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {consents.map((consent) => (
          <ConsentItem
            key={consent.id}
            consent={consent}
            onRevoke={() => handleRevokeClick(consent)}
            onGrant={() => grantConsent(consent.type)}
          />
        ))}
      </div>

      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Отзыв согласия
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отозвать согласие на "{selectedConsent?.title}"?
              {selectedConsent?.type === "medical_data" && (
                <span className="mt-2 block text-amber-600">
                  Внимание: это может ограничить функциональность сервиса.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmRevoke}>
              Отозвать согласие
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ConsentItemProps {
  consent: Consent
  onRevoke: () => void
  onGrant: () => void
}

function ConsentItem({ consent, onRevoke, onGrant }: ConsentItemProps) {
  const isMedical = consent.type === "medical_data"

  return (
    <div
      className={`flex items-start justify-between rounded-lg p-4 ${
        isMedical ? "border border-purple-200 bg-purple-50" : "bg-gray-50"
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
            <p className="text-sm font-medium text-gray-900">{consent.title}</p>
            <span
              className={`rounded px-2 py-0.5 text-xs ${
                consent.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {consent.isActive ? "Активно" : "Отозвано"}
            </span>
            {consent.isRequired && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                Обязательное
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{consent.description}</p>
          {consent.grantedAt && (
            <p className="mt-1 text-xs text-gray-500">
              {consent.isActive ? "Дата согласия: " : "Отозвано: "}
              {new Date(consent.revokedAt || consent.grantedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
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
