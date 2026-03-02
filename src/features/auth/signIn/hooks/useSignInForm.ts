import { useNavigate } from "react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { logger } from "@/shared/lib/logger"
import { useLogin } from "@/entities/auth/api/auth.queries"
import { LoginSchema, type LoginDto } from "@/entities/auth/model/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ROUTES } from "@/shared/model/routes"

export const useSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: login, isPending } = useLogin()

  const onSubmit = async (data: LoginDto) => {
    login(data, {
      onSuccess: (auth) => {
        logger.info("Вход выполнен успешно через форму", {
          email: auth.email,
        })
        toast.success("Вход выполнен успешно")
        navigate(ROUTES.MAIN)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorData = error.response?.data || error
        const message = errorData.message || ""
        const code = errorData.code || ""

        if (message === "Email not confirmed" || code === "email_not_confirmed") {
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

        if (message === "Invalid login credentials" || code === "invalid_credentials") {
          toast.error("Неправильная почта или пароль!")
          return
        }

        logger.error("Ошибка входа через форму", error as Error, {
          email: data.email,
        })
        toast.error(message || "Произошла ошибка при входе")
      },
    })
  }

  return {
    showPassword,
    isLoading: isPending,
    form,
    setShowPassword,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
