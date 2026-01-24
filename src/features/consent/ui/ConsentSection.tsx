import { useState } from "react"
import { FileText, Check } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { ConsentModal } from "./ConsentModal"
import { PrivacyModal } from "@/widgets/privacyModal/ui/PrivacyModal"
import type { UserRole } from "@/entities/user/types/types"

interface Props {
  hasConsent: boolean
  userRole: UserRole
  onAccept: () => void
  onShowPrivacyModal?: () => void
}

export const ConsentSection = ({ hasConsent, userRole, onAccept, onShowPrivacyModal }: Props) => {
  const isMobile = useIsMobile()
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleOpenConsentModal = () => {
    setShowConsentModal(true)
  }

  const handleCloseConsentModal = () => {
    setShowConsentModal(false)
  }

  const handleAccept = () => {
    onAccept()
    setShowConsentModal(false)
  }

  const handleOpenPrivacyModal = () => {
    setShowPrivacyModal(true)
    setShowConsentModal(false)
    onShowPrivacyModal?.()
  }

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false)
    if (!hasConsent) {
      setShowConsentModal(true)
    }
  }

  if (!hasConsent) {
    return (
      <>
        <Button
          onClick={handleOpenConsentModal}
          variant="secondary"
          className="h-auto w-full justify-start text-left"
        >
          <div className="flex w-full items-center gap-3 sm:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 sm:size-12">
              <FileText className="size-5 sm:size-6" />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <h4 className="text-foreground text-sm font-semibold break-words sm:text-base">
                Требуется согласие на обработку данных
              </h4>
              {!isMobile && (
                <p className="text-foreground/50 mt-0.5 text-sm break-words">
                  Нажмите для ознакомления и принятия согласия (152-ФЗ)
                </p>
              )}
            </div>
          </div>
        </Button>

        {showConsentModal && (
          <ConsentModal
            userRole={userRole}
            onAccept={handleAccept}
            onDecline={handleCloseConsentModal}
            onShowPrivacyModal={handleOpenPrivacyModal}
          />
        )}

        {showPrivacyModal && <PrivacyModal onClose={handleClosePrivacyModal} />}
      </>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border-2 border-green-300 bg-green-50 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3",
        "cursor-default mb-4",
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 sm:size-12">
        <Check className="size-5 sm:size-6" />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <h4 className="text-foreground mb-1 text-sm font-semibold break-words sm:text-base">
          Согласие на обработку данных получено
        </h4>
        {!isMobile && (
          <p className="text-foreground/50 text-xs break-words sm:text-sm">
            Вы можете продолжить регистрацию
          </p>
        )}
      </div>
    </div>
  )
}
