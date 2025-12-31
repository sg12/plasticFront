import { useState } from "react"
import type { SignUpFormData } from "../model/types"
import type { UserRole } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "../model/schema"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { signUp } from "@/entities/auth/api/api"
import { createUser } from "@/entities/user/api/api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
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
      patient: {
        birthDate: "",
        gender: undefined,
      },
    },
    mode: "onBlur",
  })

  const role = form.watch("role") as UserRole

  const handleFileChange = <
    R extends keyof UploadedFilesByRole,
    K extends keyof NonNullable<UploadedFilesByRole[R]>,
  >(
    role: R,
    e: React.ChangeEvent<HTMLInputElement>,
    key: K,
  ) => {
    const files = e.target.files
    if (!files?.length) return

    setUploadedFiles((prev) => ({
      ...prev,
      [role]: {
        ...(prev?.[role] ?? {}),
        [key]: files.length > 1 ? Array.from(files) : files[0],
      },
    }))
  }

  const handleNextStep = async () => {
    let isValid = true

    // Валидация в зависимости от текущего шага
    if (currentStep === 1) {
      // Валидация базовых данных
      isValid = await form.trigger("basic")
    } else if (currentStep === 2) {
      // Валидация специфичных для роли данных
      if (role === USER_ROLES.DOCTOR) {
        isValid = await form.trigger("doctor")
      } else if (role === USER_ROLES.CLINIC) {
        isValid = await form.trigger("clinic")
      }
    }

    // Переходим на следующий шаг только если валидация прошла
    if (isValid) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }

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
      setShowConsentModal(true)
      return
    }

    setIsLoading(true)

    try {
      // Регистрация в Supabase Auth
      const signUpResult = await signUp({
        email: data.basic.email,
        password: data.basic.password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`,
          data: {
            phone: data.basic.phone,
            full_name: data.basic.fullName,
          },
        },
      })

      if (!signUpResult) {
        toast.error("Ошибка при регистрации: функция signUp не вернула результат")
        setIsLoading(false)
        return
      }

      const { data: authData, error: authError } = signUpResult

      if (authError) {
        toast.error(authError.message || "Ошибка регистрации")
        setIsLoading(false)
        return
      }

      if (!authData?.user) {
        toast.error("Не удалось создать пользователя")
        setIsLoading(false)
        return
      }

      // Создаём профиль пользователя (файлы загружаются внутри createUser)
      try {
        await createUser(authData.user.id, data, uploadedFiles)
      } catch (profileError: any) {
        console.error("Ошибка создания профиля:", profileError)
        const errorMessage =
          profileError?.message ||
          profileError?.error?.message ||
          "Ошибка создания профиля. Регистрация не завершена."
        toast.error(errorMessage)
        setIsLoading(false)
        return
      }

      toast.success("Регистрация выполнена успешно")
      navigate("/signin")
    } catch (error) {
      toast.error("Произошла ошибка при регистрации")
      console.error("Ошибка регистрации:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,

    role,
    currentStep,
    uploadedFiles,

    isLoading,

    showConsentModal,
    showPrivacyModal,
    hasConsent,

    handleFileChange,
    handleNextStep,
    handlePrevStep,

    openConsentModal,
    closeConsentModal,
    openPrivacyModal,
    closePrivacyModal,
    acceptConsent,

    onSubmit,
  }
}
