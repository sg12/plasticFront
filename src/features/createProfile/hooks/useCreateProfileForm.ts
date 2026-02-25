import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { FormProvider } from "react-hook-form"
import { ROUTES } from "@/shared/model/routes"
import { useMe } from "@/entities/user/api/user.queries"
import type { ROLE } from "@/entities/user/types/user.types"
import { useAuthStore } from "@/entities/auth/model/auth.store"
import { useCreateProfile } from "@/entities/profile/api/profile.queries"
import { CreateProfileSchema, type CreateProfileDto } from "@/entities/profile/model/profile.schema"

type UploadedFilesState = {
  [key in ROLE]?: {
    [fileKey: string]: File | File[]
  }
}

const STORAGE_KEY = "profile_form_draft"

export const useCreateProfileForm = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({})
  const { data: user } = useMe()
  const isAuth = useAuthStore((state) => !!state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const [currentStep, setCurrentStep] = useState(0)

  const navigate = useNavigate()

  const role = user?.role as ROLE

  const getSavedData = () => {
    if (typeof window === "undefined") return undefined
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return undefined
    try {
      return JSON.parse(saved)
    } catch {
      return undefined
    }
  }

  const form = useForm<CreateProfileDto>({
    resolver: zodResolver(CreateProfileSchema),
    defaultValues: getSavedData() || {
      role: user?.role as ROLE,
      patient: user?.patient || undefined,
      doctor: user?.doctor || undefined,
      clinic: user?.clinic || undefined,
    },
    mode: "all",
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get("accessToken")

    if (tokenFromUrl && !isAuth) {
      setToken(tokenFromUrl)

      window.history.replaceState({}, document.title, window.location.pathname)

      toast.success("Почта подтверждена! Заполните профиль.")
    }
  }, [isAuth, setToken])

  useEffect(() => {
    const hasTokenInUrl = new URLSearchParams(window.location.search).has("accessToken")

    if (!isAuth && !hasTokenInUrl) {
      navigate(ROUTES.SIGNUP)
      toast.info("Пожалуйста, войдите в систему, чтобы продолжить.")
    }
  }, [navigate, role, form, user, isAuth])

  const handleFileChange = <R extends keyof UploadedFilesState, K extends string>(
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

  const { mutateAsync: createProfile, isPending } = useCreateProfile()

  const onSubmit = async (data: CreateProfileDto) => {
    if (!user) return

    const roleKey = role
    const profileKey = role.toLowerCase()

    const payload = {
      role: roleKey,
      [profileKey]: data,
    } as unknown as CreateProfileDto

    const allFiles = Object.values(uploadedFiles)
      .flatMap((roleFiles) => Object.values(roleFiles))
      .filter((file): file is File => file instanceof File)

    await createProfile(
      {
        dto: payload,
        files: allFiles,
      },
      {
        onSuccess: () => {
          localStorage.removeItem(STORAGE_KEY)
        },
      },
    )
  }

  return {
    form,
    role,
    currentStep,
    setCurrentStep,
    isLoading: isPending,
    uploadedFiles,
    handleFileChange,
    onSubmit: form.handleSubmit(onSubmit, (errors) => {
      console.log(errors)
      // toast.error(Object.values(errors).message)
    }),
    FormProvider,
  }
}
