import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { createUser } from "@/entities/user/api/api"
import { logger } from "@/shared/lib/logger"
import type {
  ClinicUploadedFiles,
  DoctorUploadedFiles,
  UploadedFilesByRole,
} from "@/entities/document/types/types"
import { getSession } from "@/entities/auth/api/api"
import type { FileSlot } from "@/features/fileUpload/types/types"
import type { UserCreateFormData, UserRole } from "@/entities/user/types/types"
import { userCreateSchema } from "@/entities/user/model/schema"
import { FormProvider } from "react-hook-form"
import { ROUTES } from "@/shared/model/routes"

export const useCreateProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({})
  const { user, session, initialized, profile } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      navigate(ROUTES.MAIN)
    }
  }, [profile])

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
    if (initialized && !session) {
      navigate(ROUTES.SIGNUP)
      toast.info("Пожалуйста, войдите в систему, чтобы продолжить.")
    }
    if (role) {
      form.setValue("role", role)
    }
  }, [session, initialized, navigate, role, form])

  const doctorFileSlots: FileSlot<DoctorUploadedFiles>[] = [
    { id: "diploma", label: "Диплом о медицинском образовании" },
    { id: "license", label: "Медицинская лицензия" },
    { id: "certificate", label: "Сертификат специалиста" },
  ]

  const clinicFileSlots: FileSlot<ClinicUploadedFiles>[] = [
    {
      id: "clinicDocuments",
      label: "Документы клиники (можно загрузить несколько файлов)",
      multiple: true,
    },
  ]

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

  const onSubmit = async (data: UserCreateFormData) => {
    if (!user) {
      toast.error("Пользователь не аутентифицирован.")
      return
    }

    setIsLoading(true)

    const { data: sessionData } = await getSession()

    if (!sessionData.session) {
      toast.error("Сессия не найдена, пожалуйста, войдите снова.")
      navigate(ROUTES.SIGNIN)
      setIsLoading(false)
      return
    }

    const fullData = {
      ...data,
      email: sessionData.session.user.email!,
      fullName: sessionData.session.user.user_metadata.fullName,
      phone: sessionData.session.user.user_metadata.phone,
    }

    try {
      await createUser(user.id, fullData, uploadedFiles)
      toast.success("Профиль успешно создан!")
      navigate(0)
    } catch (error: any) {
      logger.error("Ошибка создания профиля", error as Error, {
        userId: user.id,
        role: fullData.role,
      })
      if (error?.message === "USER_ALREADY_EXISTS" || error?.code === "23505") {
        toast.info("Профиль для этого пользователя уже существует.")
        navigate(ROUTES.MAIN)
      } else {
        toast.error(error.message || "Ошибка при создании профиля.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClick = async () => {
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
    doctorFileSlots,
    clinicFileSlots,
    onSubmit,
    handleSaveClick,
    FormProvider,
  }
}
