/**
 * @fileoverview Хук для управления редактированием профиля
 *
 * Содержит бизнес-логику обновления профиля пользователя
 *
 * @module features/profile/hooks/useProfile
 */

import { useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateUserSchema, type UpdateUserDto } from "@/entities/user/model/user.schema"
import { useMe, useUpdateMe } from "@/entities/user/api/user.queries"

export const useProfile = () => {
  const { data: user } = useMe()
  const { mutateAsync, isPending } = useUpdateMe()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(UpdateUserSchema),
    values: useMemo(
      () => ({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        patient: user?.patient || undefined,
        doctor: user?.doctor || undefined,
        clinic: user?.clinic || undefined,
      }),
      [user],
    ),
  })

  const onSubmit = async (data: UpdateUserDto) => {
    await mutateAsync(data)
    form.reset(data)
    setIsEditing(false)
  }

  return {
    user,
    isEditing,
    form,
    isSaving: isPending,
    startEdit: () => setIsEditing(true),
    cancelEdit: () => {
      setIsEditing(false)
      form.reset()
    },
    onSubmit: form.handleSubmit(onSubmit),
    isFormChanged: form.formState.isDirty,
    FormProvider,
  }
}
