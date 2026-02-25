import { useUpdateAvatar } from "@/entities/file/api/file.queries"
import { useEffect, useRef, useState } from "react"

export const useAvatarUpload = (onSuccess?: () => void) => {
  // const queryClient = useQueryClient()
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: updateAvatar, isPending: isSavingAvatar } = useUpdateAvatar(() => {
    setPreviewAvatarUrl(null)
    onSuccess?.()
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setPreviewAvatarUrl(previewUrl)

    try {
      await updateAvatar(file)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    return () => {
      if (previewAvatarUrl) URL.revokeObjectURL(previewAvatarUrl)
    }
  }, [previewAvatarUrl])

  return {
    isSavingAvatar,
    previewAvatarUrl,
    fileInputRef,
    handleAvatarUpload,
    handleAvatarClick: () => fileInputRef.current?.click(),
  }
}
