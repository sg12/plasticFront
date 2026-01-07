import React, { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/shared/api/supabase/client"
import { useAuthStore } from "@/entities/auth/model/store"

export function useEmailVerification() {
  const { user } = useAuthStore()
  const [isSending, setIsSending] = useState(false)

  const email = user?.email || ""
  const isVerified = !!user?.email_confirmed_at

  const sendVerificationEmail = async () => {
    if (!email) {
      toast.error("Email не указан")
      return
    }

    if (isVerified) {
      toast.info("Email уже подтверждён")
      return
    }

    setIsSending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        toast.error(error.message || "Не удалось отправить письмо")
        return
      }

      toast.success("Письмо отправлено! Проверьте почту")
    } catch (e) {
      console.error("Ошибка отправки письма:", e)
      toast.error("Ошибка отправки письма")
    } finally {
      setIsSending(false)
    }
  }

  return {
    email,
    isVerified,
    isSending,
    sendVerificationEmail,
  }
}
