import { useState } from "react"
import type { SignUpFormData } from "../model/types"
import type { UserRole } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "../model/schema"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const { signUp, loading } = useAuthStore()

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
      const { error } = await signUp(data)

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.info("Пользователь с таким email уже существует. Войдите в систему.")
        } else {
          toast.error(error.message || "Ошибка регистрации")
        }
        return
      }

      toast.success("Регистрация прошла успешно. Пожалуйста, подтвердите свой email.")
    } catch (error) {
      toast.error("Произошла неизвестная ошибка при регистрации.")
      console.error("Ошибка регистрации:", error)
    }
  }

  return {
    form,
    role,
    loading,
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
  }
}
