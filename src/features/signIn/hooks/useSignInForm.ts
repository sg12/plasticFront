import { useState } from "react"
import { signInSchema, type SignInFormData } from "../model/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithPassword } from "@/entities/auth/api/api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { USER_ROLES } from "@/entities/user/model/constants"
import { getUser } from "@/entities/user/api/api"
import { requestModeration } from "@/shared/api/supabase/moderation"
import { getFileUrls } from "@/entities/document/api/api"
import type { DoctorProfile, ClinicProfile } from "@/entities/user/types/types"
import { recordLogin } from '@/features/loginHistory/api/api'

export const useSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    try {
      const { data: authData, error } = await signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message || "Ошибка входа")
        return
      }

      if (authData?.session) {
        // Если doctor/clinic еще не approved — отправляем повторную заявку модераторам
        try {
          const userId = authData.user?.id ?? authData.session.user.id
          const profile = await getUser(userId)

          const isDoctorOrClinic =
            profile.role === USER_ROLES.DOCTOR || profile.role === USER_ROLES.CLINIC

          if (isDoctorOrClinic && profile.moderation_status !== "approved") {
            // Получаем файлы из БД и создаём signed URLs
            let files: Array<{ name: string; url?: string }> = []
            const roleProfile = profile as DoctorProfile | ClinicProfile

            if (roleProfile.documents) {
              try {
                files = await getFileUrls(roleProfile.documents)
              } catch (fileError) {
                console.error("Ошибка получения файлов из Storage:", fileError)
                // Продолжаем без файлов, но логируем ошибку
              }
            }

            const { error: moderationError } = await requestModeration({
              profileId: userId,
              role: profile.role,
              fullName: profile.full_name ?? "",
              email: authData.user?.email ?? data.email,
              phone: profile.phone ?? undefined,
              files,
            })

            if (moderationError) {
              console.error("Ошибка повторной отправки заявки на модерацию:", moderationError)
            }
          }
        } catch (e) {
          console.error("Не удалось проверить профиль для модерации:", e)
        }

        // Записываем в историю входов
        const userId = authData.user?.id ?? authData.session.user.id
        await recordLogin(userId, true)

        toast.success("Вход выполнен успешно")
        navigate("/main")
      }
    } catch (error) {
      toast.error("Произошла ошибка при входе")
      console.error("Ошибка входа:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    showPassword,
    isLoading,
    form,

    setShowPassword,
    setIsLoading,

    onSubmit,
  }
}
