import { Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar"
import { formatName, formatRole } from "../../../shared/lib/utils"
import { Separator } from "../../../shared/ui/separator"
import { Badge } from "../../../shared/ui/badge"
import type { RoleProfile, UserRole } from "../../../entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"

interface Props {
  profile: RoleProfile | null
}

export const UserProfileCard = ({ profile }: Props) => {
  return (
    <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-6 text-center">
      <Avatar className="mx-auto mb-4 size-32">
        <AvatarImage />
        <AvatarFallback className="text-3xl">
          {profile && profile.role === USER_ROLES.CLINIC
            ? formatName(profile.legalName ?? "Клиника")
            : formatName(profile?.fullName ?? "Имя Фамилия", true)}
        </AvatarFallback>
      </Avatar>
      <Badge variant="outline">{formatRole(profile?.role as UserRole)}</Badge>
      <h3>
        {profile && profile.role === USER_ROLES.CLINIC ? profile.legalName : profile?.fullName}
      </h3>
      <p className="mt-1 text-gray-600">ID: {profile?.id ?? "—"}</p>
      <Separator className="my-6" />
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{profile?.email ?? "example@mail.ru"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{profile?.phone ?? "+79999999999"}</span>
        </div>
      </div>
    </div>
  )
}
