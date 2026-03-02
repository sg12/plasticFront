import { Hospital, Check, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar"
import { formatName } from "../../shared/lib/utils"
import { CardTitle, CardDescription } from "@/shared/ui/card"
import { useClipboard } from "@/shared/hooks/useClipboard"
import { cn } from "@/shared/lib/utils"
import { useAvatarUpload } from "@/features/user-management/profile/avatar/hooks/useAvatarUpload"
import type { User } from "@/entities/user/types/user.types"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { useMe } from "@/entities/user/api/user.queries"
import { IMAGE_ACCEPT_TYPES_STRING } from "@/entities/file/model/file.constants"

interface Props {
  user: User
}

export const UserProfileCard = ({ user }: Props) => {
  const { data: authUser } = useMe()
  const isOwnProfile = authUser?.id === user?.id

  const { isSavingAvatar, previewAvatarUrl, fileInputRef, handleAvatarUpload, handleAvatarClick } =
    useAvatarUpload()

  const { copy: copyId, copied } = useClipboard(user?.id, {
    successMessage: "ID скопирован в буфер обмена",
  })

  return (
    <div className="max-md:space-child flex max-md:flex-col max-md:items-center max-md:text-center ">
      <div className="relative">
        <Avatar
          className={cn(
            "size-24 border-1",
            isOwnProfile && "cursor-pointer transition-opacity hover:opacity-70",
            isSavingAvatar && "opacity-30"
          )}
          onClick={() => isOwnProfile && handleAvatarClick()}
        >
          <AvatarImage
            src={`${user.avatar}?t=${new Date(user.updatedAt).getTime()}`}
            key={previewAvatarUrl ? 'preview' : `${user?.avatar}-${user?.updatedAt}`}
          />
          <AvatarFallback className="text-3xl">
            {user?.role === USER_ROLE.CLINIC ? (
              <Hospital className="size-10" />
            ) : (
              formatName(user?.fullName ?? "", true)
            )}
          </AvatarFallback>
        </Avatar>
        {isOwnProfile && (
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT_TYPES_STRING}
            onChange={handleAvatarUpload}
            className="hidden"
          />
        )}
      </div>
      <div className="max-md:mt-4 md:ml-4">
        <CardTitle>
          {user?.role === USER_ROLE.CLINIC ? (
            user?.clinic.brandName
          ) : (
            user?.fullName
          )}
        </CardTitle>
        <CardDescription>
          <span
            className="inline-flex cursor-pointer items-center gap-2 hover:text-foreground transition-colors"
            onClick={copyId}
          >
            {user?.id ? `${user.id.substring(0, 20)}...` : "—"}
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </span>
        </CardDescription>
      </div>
    </div>
  )
}
