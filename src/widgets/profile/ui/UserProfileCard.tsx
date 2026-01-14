import { Hospital, Mail, Phone, Check, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar"
import { formatName, formatRole } from "../../../shared/lib/utils"
import { Separator } from "../../../shared/ui/separator"
import { Badge } from "../../../shared/ui/badge"
import type { RoleProfile, UserRole } from "../../../entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { useClipboard } from "@/shared/hooks/useClipboard"

interface Props {
  profile: RoleProfile | null
}

export const UserProfileCard = ({ profile }: Props) => {
  const roleLabel = profile?.role ? formatRole(profile.role as UserRole) : "—"
  const fullName = profile?.fullName?.trim() || "—"
  const email = profile?.email?.trim() || "—"
  const phone = profile?.phone?.trim() || "—"
  const { copy: copyId, copied } = useClipboard(profile?.id, {
    successMessage: "ID скопирован в буфер обмена",
    errorMessage: "Не удалось скопировать ID",
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto">
          <Avatar className="mx-auto size-24">
            <AvatarImage />
            <AvatarFallback className="text-3xl">
              {profile && profile.role === USER_ROLES.CLINIC ? (
                <Hospital className="size-10" />
              ) : (
                formatName(profile?.fullName ?? "", true) || "—"
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-3 flex flex-col items-center gap-2">
          <Badge variant="outline">{roleLabel}</Badge>
          <CardTitle className="text-base">{fullName}</CardTitle>
          <CardDescription>
            <span className="inline-flex cursor-pointer items-center gap-2" onClick={copyId}>
              {profile?.id ?? "—"}{" "}
              {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground flex items-center gap-3">
            <Mail className="h-4 w-4" />
            <span className="min-w-0 truncate">{email}</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-3">
            <Phone className="h-4 w-4" />
            <span className="min-w-0 truncate">{phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
