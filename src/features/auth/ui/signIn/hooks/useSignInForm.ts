import { useNavigate } from "react-router"
import { useState } from "react"
import { signInSchema, type SignInFormData } from "../model/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"

export const useSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuthStore()
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
    try {
      const { data: authData, error } = await signIn(data)

      if (error?.message === "Email not confirmed" || error?.code === "email_not_confirmed") {
        toast("Подтвердите ваш email", {
          action: {
            label: "Перейти",
            onClick: (e) => {
              window.location.href = `mailto:${data.email}`
              e.preventDefault()
            },
          },
          duration: 10000,
        })
        return
      }

      if (error?.message === "Invalid login credentials" || error?.code === "invalid_credentials") {
        toast.error("Неправильная почта или пароль!")
        return
      }

      if (error) {
        toast.error(error.message || "Ошибка входа")
        return
      }

      if (!authData.user) {
        toast.error("Ошибка входа: не удалось получить данные пользователя.")
        return
      }

      toast.success("Вход выполнен успешно")
      navigate(0)
    } catch (error) {
      toast.error("Произошла ошибка при входе")
      console.error("Ошибка входа:", error)
    } finally {
    }
  }

  return {
    showPassword,
    isLoading: form.formState.isSubmitting,
    form,

    setShowPassword,

    onSubmit,
  }
}
