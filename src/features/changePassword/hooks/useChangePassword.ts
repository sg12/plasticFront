import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { supabase } from "@/shared/api/supabase/client"
import { changePasswordSchema, type ChangePasswordFormValues } from "../model/schema"
import { logger } from "@/shared/lib/logger"

export function useChangePassword() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const setOpenSafe = (next: boolean) => {
    setOpen(next)
    if (!next) {
      form.reset()
    }
  }

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        toast.error("Нужно войти в аккаунт")
        return
      }

      // TODO: ПЕРЕДЕЛАТЬ, НЕ ИСПОЛЬЗОВАТЬ ТАКОЙ МЕТОД
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ password: values.newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error_description || data.msg || "Ошибка смены пароля")
        return
      }

      toast.success("Пароль успешно обновлён")
      form.reset()
      setOpenSafe(false)
    } catch (e) {
      console.error("[ChangePassword] Исключение:", e)
      toast.error("Ошибка при смене пароля")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    open,
    setOpen: setOpenSafe,
    form,
    onSubmit,
    isLoading,
  }
}
