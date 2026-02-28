import { Skeleton } from "@/shared/ui/skeleton"
import type { Consent } from "@/entities/consent/types/consent.types"
import { ConsentItem } from "./ConsentItem"
import { useConsents } from "@/entities/consent/api/consent.queries"
import { useMe } from "@/entities/user/api/user.queries"

export const ConsentStatus = () => {
  const { data: consents, isLoading } = useConsents()
  const { data: user } = useMe()

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
    <div className="space-child">
      {consents?.map((consent: Consent) => (
        <ConsentItem
          key={consent.id}
          consent={consent}
          userConsents={user?.userConsents || []}
        />
      ))}
    </div>
  )
}
