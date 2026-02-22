import { useState } from "react"
import type { SignUpFormData } from "../types/types"
import type { UserRole } from "@/entities/user/types/user.types"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "../model/schema"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { FormProvider } from "react-hook-form"
import { logger } from "@/shared/lib/logger"

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const { signUp } = useAuthStore()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: USER_ROLES.PATIENT,
      basic: {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      },
    },
    mode: "onSubmit",
  })

  const role = form.watch("role") as UserRole

  const openConsentModal = () => setShowConsentModal(true)
  const closeConsentModal = () => setShowConsentModal(false)

  const openPrivacyModal = () => {
    setShowConsentModal(false)
    setShowPrivacyModal(true)
  }

  const closePrivacyModal = () => setShowPrivacyModal(false)

  const acceptConsent = () => {
    setHasConsent(true)
    setShowConsentModal(false)
  }

  const onSubmit = async (data: SignUpFormData) => {
    if (!hasConsent) {
      openConsentModal()
      return
    }

    try {
      const { data: authData, error } = await signUp(data)

      if (error && error.message.includes("User already registered")) {
        toast.warning("Пользователь с таким email уже существует. Войдите в систему.")
        return
      }

      if (authData && !authData.user?.identities?.length) {
        toast.warning("Пользователь с таким email уже существует. Войдите в систему.")
        return
      }

      logger.info("Регистрация прошла успешно через форму", {
        email: data.basic.email,
        role: data.role,
      })
      toast.success("Регистрация прошла успешно. Пожалуйста, подтвердите свой email.")
    } catch (error) {
      logger.error("Ошибка регистрации через форму", error as Error, {
        email: data.basic.email,
        role: data.role,
      })
      toast.error("Произошла неизвестная ошибка при регистрации.")
    }
  }

  return {
    form,
    role,
    loading: form.formState.isSubmitting,
    currentStep,
    setCurrentStep,
    showConsentModal,
    showPrivacyModal,
    hasConsent,
    openConsentModal,
    closeConsentModal,
    openPrivacyModal,
    closePrivacyModal,
    acceptConsent,
    onSubmit,
    FormProvider,
  }
}
