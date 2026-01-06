import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { createUser } from "@/entities/user/api/api"
import type { ClinicUploadedFiles, DoctorUploadedFiles, UploadedFilesByRole } from "@/entities/document/types/types"
import { createProfileSchema } from "../model/schema"
import type { CreateProfileFormData } from "../model/types"
import { getSession } from "@/entities/auth/api/api"
import type { FileSlot } from '@/features/fileUpload/types/types'

export const useCreateProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({})
  const { user, session, initialized, profile } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      navigate("/main")
    }
  }, [profile])

  const role = user?.user_metadata.role?.toLowerCase() as
    | "patient"
    | "doctor"
    | "clinic"
    | undefined

  const form = useForm<CreateProfileFormData>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      role: role,
      patient: {
        birthDate: undefined,
        gender: undefined,
      },
      doctor: {
        licenseNumber: "",
        specialization: "",
        experience: undefined,
        education: "",
        workplace: "",
        inn: "",
        gender: undefined,
        birthDate: undefined,
        documents: {},
      },
      clinic: {
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
    },
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialized && !session) {
      navigate("/signup")
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

  const onSubmit = async (data: CreateProfileFormData) => {
    if (!user) {
      toast.error("Пользователь не аутентифицирован.")
      return
    }

    setIsLoading(true)

    const { data: sessionData } = await getSession()

    if (!sessionData.session) {
      toast.error("Сессия не найдена, пожалуйста, войдите снова.")
      navigate("/signin")
      setIsLoading(false)
      return
    }

    const fullData = {
      basic: {
        email: sessionData.session.user.email!,
        fullName: sessionData.session.user.user_metadata.full_name,
        phone: sessionData.session.user.user_metadata.phone,
      },
      ...data,
    }

    try {
      await createUser(user.id, fullData, uploadedFiles)
      toast.success("Профиль успешно создан!")
      navigate(0)
    } catch (error: any) {
      console.error("Ошибка создания профиля:", error)
      if (error?.message === "USER_ALREADY_EXISTS" || error?.code === "23505") {
        toast.info("Профиль для этого пользователя уже существует.")
        navigate("/main")
      } else {
        toast.error(error.message || "Ошибка при создании профиля.")
      }
    } finally {
      setIsLoading(false)
    }
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
  }
}
