/**
 * @fileoverview Хук для управления редактированием профиля
 *
 * Содержит бизнес-логику обновления профиля пользователя
 *
 * @module features/profile/hooks/useProfile
 */

import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { updateUser } from "@/entities/user/api/api"
import type { RoleProfile, UserUpdateFormData } from "@/entities/user/types/types"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { userUpdateSchema } from "@/entities/user/model/schema"
import { logger } from "@/shared/lib/logger"
import { useUserStore } from "@/entities/user/model/store"

export const useProfile = () => {
  const { profile } = useUserStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editableProfile, setEditableProfile] = useState<RoleProfile | null>(profile as RoleProfile)

  const defaultValues = useMemo<UserUpdateFormData | undefined>(() => {
    if (!profile) return undefined
    return profile as UserUpdateFormData
  }, [profile])

  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile && defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  useEffect(() => {
    if (!isEditing) {
      setEditableProfile(profile)
    } else if (profile) {
      setEditableProfile((prev) => {
        if (prev && profile && prev.id === profile.id) {
          return { ...prev, ...profile } as RoleProfile
        }
        return profile
      })
    }
  }, [profile, isEditing])

  useEffect(() => {
    if (!isEditing || !profile) return

    const subscription = form.watch((values) => {
      setEditableProfile({
        ...profile,
        ...(values as Partial<RoleProfile>),
      })
    })
    return () => subscription.unsubscribe()
  }, [form, isEditing, profile])

  const startEdit = () => {
    if (!profile) return
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditableProfile(profile)
  }

  const onSubmit = async (data: UserUpdateFormData) => {
    if (!profile) {
      toast.error("Профиль не загружен")
      return
    }
    setIsSaving(true)

    try {
      const updatedProfile = { ...profile, ...data }
      logger.debug("Обновление профиля", {
        userId: profile.id,
        role: profile.role,
        changedFields: Object.keys(data),
      })

      await updateUser(updatedProfile.id, updatedProfile)
      logger.info("Профиль успешно обновлен через хук", {
        userId: profile.id,
        role: profile.role,
      })
      toast.success("Профиль успешно обновлён")
      setIsEditing(false)
      setIsSaving(false)
    } catch (error) {
      logger.error("Ошибка сохранения профиля через хук", error as Error, {
        userId: profile.id,
      })
      toast.error("Не удалось сохранить изменения")
    }
  }

  const handleSaveClick = async () => {
    onSubmit(form.getValues())
  }

  const isFormChanged = () => {
    const currentValues = form.getValues()

    return JSON.stringify(currentValues) !== JSON.stringify(defaultValues)
  }

  return {
    profile,
    isEditing,
    editableProfile,
    form,
    isSaving,
    startEdit,
    cancelEdit,
    onSubmit,
    handleSaveClick,
    isFormChanged,
    FormProvider,
  }
}