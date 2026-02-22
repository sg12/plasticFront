import { Hospital, Check, Copy, Camera, Loader } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar"
import { formatName } from "../../../shared/lib/utils"
import type { RoleProfile } from "../../../entities/user/types/user.types"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import { CardTitle, CardDescription } from "@/shared/ui/card"
import { useClipboard } from "@/shared/hooks/useClipboard"
import { useUserStore } from "@/entities/user/model/user.store"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { useAvatarUpload } from "@/features/profile/hooks/useAvatarUpload"
import { IMAGE_ACCEPT_TYPES_STRING } from "@/shared/model/constants"

interface Props {
  profile: RoleProfile | null
  isEditing?: boolean
  onProfileUpdate?: () => void
}

export const UserProfileCard = ({ profile, isEditing = false, onProfileUpdate }: Props) => {
  const fullName = profile?.fullName?.trim() || "—"
  const userId = profile?.id.substring(0, 20)
  const { profile: currentUserProfile } = useUserStore()
  const isOwnProfile = currentUserProfile?.id === profile?.id

  const { isUploading, previewAvatarUrl, fileInputRef, handleAvatarUpload, handleAvatarClick } =
    useAvatarUpload(profile, onProfileUpdate)

  const displayProfile = previewAvatarUrl
    ? ({
      ...profile,
      avatarUrl: previewAvatarUrl,
      updatedAt: new Date().toISOString(),
    } as RoleProfile)
    : profile

  const { copy: copyId, copied } = useClipboard(profile?.id, {
    successMessage: "ID скопирован в буфер обмена",
    errorMessage: "Не удалось скопировать ID",
  })

  const handleAvatarClickWithCheck = () => {
    if (isOwnProfile && isEditing) {
      handleAvatarClick()
    }
  }

  return (
    <div className="max-md:space-child flex max-md:flex-col max-md:items-center max-md:text-center">
      <div className="relative">
        <Avatar
          className={cn(
            "size-24 max-md:mb-4",
            isOwnProfile && isEditing && "cursor-pointer transition-opacity hover:opacity-80",
          )}
          onClick={handleAvatarClickWithCheck}
        >
          <AvatarImage
            src={
              displayProfile?.avatarUrl
                ? displayProfile.avatarUrl.includes("blob:")
                  ? displayProfile.avatarUrl
                  : `${displayProfile.avatarUrl}${displayProfile.avatarUrl.includes("?") ? "&" : "?"}t=${displayProfile.updatedAt ? new Date(displayProfile.updatedAt).getTime() : ""}`
                : undefined
            }
            key={
              displayProfile?.avatarUrl
                ? `${displayProfile.avatarUrl}-${displayProfile.updatedAt}`
                : undefined
            }
          />
          <AvatarFallback className="text-3xl">
            {profile && profile.role === USER_ROLES.CLINIC ? (
              <Hospital className="size-10" />
            ) : (
              formatName(profile?.fullName ?? "", true) || "—"
            )}
          </AvatarFallback>
        </Avatar>
        {isOwnProfile && isEditing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT_TYPES_STRING}
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              size="iconSm"
              variant="secondary"
              className="absolute right-0 bottom-0 size-8 rounded-full shadow-md"
              onClick={handleAvatarClickWithCheck}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </Button>
          </>
        )}
      </div>
      <div className="max-md:mb-4 lg:ml-4">
        <CardTitle>{fullName}</CardTitle>
        <CardDescription>
          <span className="inline-flex cursor-pointer items-center gap-2" onClick={copyId}>
            {userId ? `${userId}...` : "—"}
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </span>
        </CardDescription>
      </div>
    </div>
  )
}
