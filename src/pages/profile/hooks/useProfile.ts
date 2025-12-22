import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useAuthStore } from "@/entities/auth/model/store"
import { updateUser } from "@/entities/user/api/api"
import { USER_ROLES } from "@/entities/user/model/constants"
import type {
  ClinicProfile,
  DoctorProfile,
  PatientProfile,
  RoleProfile,
} from "@/entities/user/types/types"
import { toast } from "sonner"

export type UseProfileResult = {
  profile: RoleProfile | null
  isEditing: boolean
  editableProfile: RoleProfile | null
  form: ReturnType<typeof useForm<RoleProfile>>
  isSaving: boolean
  startEdit: () => void
  cancelEdit: () => void
  save: () => Promise<void>
  FormProvider: typeof FormProvider
}

export function useProfile(): UseProfileResult {
  const { profile, user, loadProfile } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editableProfile, setEditableProfile] = useState<RoleProfile | null>(profile)

  const defaultValues = useMemo<RoleProfile | undefined>(() => {
    if (!profile) return undefined

    if (profile.role === USER_ROLES.PATIENT) {
      const p = profile as PatientProfile

      return {
        ...p,
      }
    }

    if (profile.role === USER_ROLES.DOCTOR) {
      const d = profile as DoctorProfile

      return {
        ...d,
      }
    }

    const c = profile as ClinicProfile
    return {
      ...c,
    }
  }, [profile])

  const form = useForm<RoleProfile>({
    defaultValues,
    mode: "onBlur",
  })

  useEffect(() => {
    setEditableProfile(profile)
  }, [profile])

  useEffect(() => {
    if (!isEditing) return
    const sub = form.watch((values) => {
      if (!profile) return
      setEditableProfile({ ...profile, ...(values as Partial<RoleProfile>) } as RoleProfile)
    })
    return () => sub.unsubscribe()
  }, [form, isEditing, profile])

  const startEdit = () => {
    setEditableProfile(profile)
    if (defaultValues) form.reset(defaultValues)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditableProfile(profile)
    if (defaultValues) form.reset(defaultValues)
  }

  const save = async () => {
    return form.handleSubmit(async (values) => {
      if (!profile) {
        setIsEditing(false)
        return
      }

      try {
        const next = { ...profile, ...values } as RoleProfile
        await updateUser(next.id, next as any)

        if (user?.id) {
          await loadProfile(user.id)
        }
        toast.success("Данные обновлены.")
        setIsEditing(false)
      } catch (e) {
        toast.error("Ошибка при обновление.")
        console.error("Не удалось сохранить профиль:", e)
      }
    })()
  }

  return {
    profile,
    isEditing,
    editableProfile,
    form,
    isSaving: form.formState.isSubmitting,
    startEdit,
    cancelEdit,
    save,
    FormProvider,
  }
}
