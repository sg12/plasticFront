import { format, isValid } from "date-fns"
import { ru } from "date-fns/locale"
import { ExternalLink } from "lucide-react"
import { Link } from "react-router"

import type { Consent, UserConsent } from "@/entities/consent/types/consent.types"
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/shared/ui/item"
import { Badge } from "@/shared/ui/badge"
import { Switch } from "@/shared/ui/switch"
import { useRevokeConsent, useSignConsents } from "@/entities/consent/api/consent.queries"
import { ROUTES } from "@/shared/model/routes"

export const ConsentItem = ({
  consent,
  userConsents
}: {
  consent: Consent,
  userConsents: UserConsent[]
}) => {
  const userConsent = userConsents
    .filter((uc) => uc.consentId === consent.id)
    .sort((a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime())[0]

  const { mutateAsync: sign, isPending: isSigning } = useSignConsents()
  const { mutateAsync: revoke, isPending: isRevoking } = useRevokeConsent()

  const isSigned = !!userConsent?.signedAt && !userConsent?.revokedAt
  const isRevoked = !!userConsent?.revokedAt
  const isLoading = isSigning || isRevoking

  const handleToggle = (checked: boolean) => {
    if (checked) {
      sign([consent.id])
    } else {
      revoke(consent.id)
    }
  }

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return isValid(date) ? format(date, "dd.MM.yyyy", { locale: ru }) : ""
  }

  return (
    <Item variant="outline">
      <ItemContent className="flex flex-row items-center gap-4">
        <ItemHeader className="flex-col items-start">
          <ItemTitle className="flex items-center gap-2">
            <Link
              to={ROUTES.POLICIES.replace(':id', consent.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              {consent.title}
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </Link>
            <Badge variant="outline" className="font-normal">
              v.{consent.version}
            </Badge>
          </ItemTitle>

          <ItemDescription className="flex flex-wrap items-center gap-3">
            {consent.isRequired && (
              <Badge variant="destructive" className="text-[9px] h-4 leading-none uppercase">
                Обязательно
              </Badge>
            )}

            {isSigned && (
              <span className="text-primary text-xs font-medium">
                Активно с {formatDate(userConsent.signedAt)}
              </span>
            )}

            {isRevoked && (
              <span className="text-muted-foreground text-xs italic">
                Отозвано {formatDate(userConsent.revokedAt)}
              </span>
            )}

            {!isSigned && !isRevoked && (
              <span className="text-muted-foreground text-xs">Не подписано</span>
            )}
          </ItemDescription>
        </ItemHeader>



        {!consent.isRequired && (
          <Switch
            id={`consent-${consent.id}`}
            checked={isSigned}
            disabled={isLoading || (consent.isRequired && isSigned)}
            onCheckedChange={handleToggle}
          />
        )}
      </ItemContent>
    </Item>
  )
}