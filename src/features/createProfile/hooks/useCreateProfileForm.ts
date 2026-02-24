import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { createUser } from "@/entities/user/api/user.api"
import { logger } from "@/shared/lib/logger"
import { getSession } from "@/entities/auth/api/auth.api"
import type { UserCreateFormData, UserRole } from "@/entities/user/types/user.types"
import type { UploadedFilesByRole } from "@/entities/file/types/file.types"
import { userCreateSchema } from "@/entities/user/model/user.schema"
import { FormProvider } from "react-hook-form"
import { ROUTES } from "@/shared/model/routes"
import { useUserStore } from "@/entities/user/model/user.store"

export const useCreateProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({})
  const { user, session, initialized } = useAuthStore()
  const { profile } = useUserStore()
  const [currentStep, setCurrentStep] = useState(0)

  const navigate = useNavigate()

  const role = user?.user_metadata.role?.toLowerCase() as UserRole

  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: role,
      // Patient fields
      birthDate: undefined,
      gender: undefined,
      // Doctor fields
      licenseNumber: "",
      specialization: "",
      experience: undefined,
      education: "",
      workplace: "",
      clinic: null,
      inn: "",
      // Clinic fields
      legalName: "",
      clinicInn: "",
      ogrn: "",
      legalAddress: "",
      actualAddress: "",
      clinicLicense: "",
      directorName: "",
      directorPosition: "",
      documents: {},
    },
    mode: "all",
  })

  useEffect(() => {
    if (profile) {
      navigate(ROUTES.MAIN)
    }
    if (initialized && !session) {
      navigate(ROUTES.SIGNUP)
      toast.info("Пожалуйста, войдите в систему, чтобы продолжить.")
    }
    if (role) {
      form.setValue("role", role)
    }
  }, [session, initialized, navigate, role, form, profile])

  const handleFileChange = <R extends keyof UploadedFilesByRole, K extends string>(
    role: R,
    e: React.ChangeEvent<HTMLInputElement>,
    key: K,
  ) => {
    const files = e.target.files
    if (!files?.length) {
      return
    }

    setUploadedFiles((prev) => {
      const newState = {
        ...prev,
        [role]: {
          ...(prev[role] ?? {}),
          [key]: files.length > 1 ? Array.from(files) : files[0],
        },
      }
      return newState
    })
  }

  const onSubmit = async (data: UserCreateFormData) => {
    if (!user) {
      toast.error("Пользователь не аутентифицирован.")
      return
    }

    setIsLoading(true)

    try {
      // Используем существующую сессию из store, если она есть
      let sessionData = { session }

      // Если сессии нет в store, получаем её
      if (!sessionData.session) {
        const result = await Promise.race([
          getSession(),
          new Promise<{ data: { session: null } }>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout: сессия не получена")), 10000),
          ),
        ])
        sessionData = result.data || { session: null }
      }

      if (!sessionData.session) {
        toast.error("Сессия не найдена, пожалуйста, войдите снова.")
        navigate(ROUTES.SIGNIN)
        return
      }

      const fullData = {
        ...data,
        email: sessionData.session.user.email!,
        fullName: sessionData.session.user.user_metadata.fullName,
        phone: sessionData.session.user.user_metadata.phone,
      }

      await createUser(user.id, fullData, uploadedFiles)
      toast.success("Профиль успешно создан!")
      navigate(0)
    } catch (error: any) {
      logger.error("Ошибка создания профиля", error as Error, {
        userId: user.id,
        role: data.role,
      })

      if (error?.message?.includes("Timeout")) {
        toast.error("Превышено время ожидания. Пожалуйста, попробуйте снова.")
      } else if (error?.message === "USER_ALREADY_EXISTS" || error?.code === "23505") {
        toast.info("Профиль для этого пользователя уже существует.")
        navigate(ROUTES.MAIN)
      } else {
        toast.error(error.message || "Ошибка при создании профиля.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const isValid = await form.trigger()

    if (!isValid) {
      toast.error("Пожалуйста, заполните все обязательные поля корректно.")
      return setCurrentStep(0)
    }

    onSubmit(form.getValues())
  }

  return {
    form,
    role,
    currentStep,
    setCurrentStep,
    isLoading,
    uploadedFiles,
    handleFileChange,
    onSubmit,
    handleSaveClick,
    FormProvider,
  }
}
