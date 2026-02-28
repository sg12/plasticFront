import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { FormProvider } from "react-hook-form"
import { logger } from "@/shared/lib/logger"
import type { ROLE } from "@/entities/user/types/user.types"
import type { RegisterDto } from "@/entities/auth/model/auth.schema"
import { CreateUserSchema } from "@/entities/user/model/user.schema"
import { useRegister } from "@/entities/auth/api/auth.queries"
import { useConsents } from "@/entities/consent/api/consent.queries"

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const { data: consents, isLoading } = useConsents()

  const form = useForm<RegisterDto>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      role: undefined,
      fullName: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      acceptedConsentIds: [],
    },
  })

  const { mutate: register, isPending } = useRegister()

  const role = form.watch("role") as ROLE

  const handleAcceptConsent = (acceptedIds: string[]) => {
    form.setValue("acceptedConsentIds", acceptedIds, { shouldValidate: true })
    setHasConsent(true)
    setShowConsentModal(false)
  }

  const onSubmit = async (data: RegisterDto) => {
    if (!hasConsent) {
      setShowConsentModal(true)
      return
    }

    register(data, {
      onSuccess: () => {
        logger.info("Регистрация инициирована", { email: data.email, role: data.role })
        setCurrentStep(2)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        if (error.response?.status === 409 || error.message?.includes("already registered")) {
          toast.warning("Этот email уже занят. Попробуйте войти.")
        }
      },
    })
  }

  return {
    form,
    role,
    isLoading: isPending,
    currentStep,
    setCurrentStep,
    showConsentModal,
    showPrivacyModal,
    hasConsent,
    consents,
    consentLoading: isLoading,
    openConsentModal: () => setShowConsentModal(true),
    closeConsentModal: () => setShowConsentModal(false),
    openPrivacyModal: () => {
      setShowConsentModal(false)
      setShowPrivacyModal(true)
    },
    closePrivacyModal: () => setShowPrivacyModal(false),
    acceptConsent: handleAcceptConsent,
    onSubmit: form.handleSubmit(onSubmit, (errors) => {
      toast.error(Object.values(errors)[0].message)
    }),
    FormProvider,
  }
}
