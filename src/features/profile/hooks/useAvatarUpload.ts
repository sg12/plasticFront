/**
 * @fileoverview Хук для загрузки аватара пользователя
 *
 * Содержит бизнес-логику загрузки и обновления аватара
 *
 * @module features/profile/hooks/useAvatarUpload
 */

import { useState, useRef, useEffect } from "react"
import { uploadAvatar, updateUser } from "@/entities/user/api/user.api"
import { useUserStore } from "@/entities/user/model/user.store"
import { toast } from "sonner"
import type { RoleProfile } from "@/entities/user/types/user.types"

interface UseAvatarUploadReturn {
  isUploading: boolean
  previewAvatarUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement>
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleAvatarClick: () => void
}

export const useAvatarUpload = (
  profile: RoleProfile | null,
  onSuccess?: () => void,
): UseAvatarUploadReturn => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    const previewUrl = URL.createObjectURL(file)
    setPreviewAvatarUrl(previewUrl)

    setIsUploading(true)
    try {
      // Создаем updatedAt синхронно перед async операциями
      const updatedAt = new Date().toISOString()
      const avatarUrl = await uploadAvatar(profile.id, file)
      await updateUser(profile.id, { ...profile, avatarUrl, updatedAt } as any)

      const { setProfile } = useUserStore.getState()
      const updatedProfile = { ...profile, avatarUrl, updatedAt } as RoleProfile
      setProfile(updatedProfile)

      setTimeout(() => {
        setPreviewAvatarUrl(null)
      }, 100)

      toast.success("Аватар успешно обновлён")

      onSuccess?.()
    } catch (error) {
      setPreviewAvatarUrl(null)
      toast.error(error instanceof Error ? error.message : "Не удалось загрузить аватар")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    return () => {
      if (previewAvatarUrl && previewAvatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewAvatarUrl)
      }
    }
  }, [previewAvatarUrl])

  return {
    isUploading,
    previewAvatarUrl,
    fileInputRef,
    handleAvatarUpload,
    handleAvatarClick,
  }
}
