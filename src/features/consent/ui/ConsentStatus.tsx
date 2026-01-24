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
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useConsentManagement } from "../hooks/useConsentManagement"
import type { Consent } from "@/entities/consent/types/types"
import { ConsentItem } from "./ConsentItem"
import { CONSENT_TYPES } from "@/entities/consent/model/constants"

export const ConsentStatus = () => {
  const { data: consents, isLoading, revokeConsent, grantConsent } = useConsentManagement()
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
      <div className="space-child">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="space-child">
        {consents?.map((consent: Consent) => (
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
              Вы уверены, что хотите отозвать согласие на "
              {selectedConsent?.type ? CONSENT_TYPES[selectedConsent.type]?.title : ""}"?
              {selectedConsent?.type &&
                ["medicalData", "personalData"].includes(selectedConsent.type) && (
                  <span className="mt-2 block text-amber-600">
                    Внимание: это может ограничить функциональность сервиса.
                  </span>
                )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={confirmRevoke}>
              Отозвать согласие
            </Button>
            <Button variant="primary" onClick={() => setRevokeDialogOpen(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
