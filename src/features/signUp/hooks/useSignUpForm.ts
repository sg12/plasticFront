import { useState } from "react";
import type { SignUpFormData } from "../model/types";
import type { UserRole } from "@/entities/user/types/types";
import { USER_ROLES } from "@/entities/user/model/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../model/schema";
import type { UploadedFilesByRole } from "@/entities/document/types/types";
import { signUp } from "@/entities/auth/api/api";
import { createUser, getUser } from "@/entities/user/api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { requestModeration } from "@/shared/api/supabase/moderation";
import { getFileUrls } from "@/entities/document/api/api";
import type { DoctorProfile, ClinicProfile } from "@/entities/user/types/types";

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesByRole>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const navigate = useNavigate();

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
  });

  const role = form.watch("role") as UserRole;

  const handleFileChange = <
    R extends keyof UploadedFilesByRole,
    K extends keyof NonNullable<UploadedFilesByRole[R]>
  >(
    role: R,
    e: React.ChangeEvent<HTMLInputElement>,
    key: K
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadedFiles((prev) => ({
      ...prev,
      [role]: {
        ...(prev?.[role] ?? {}),
        [key]: files.length > 1 ? Array.from(files) : files[0],
      },
    }));
  };

  const handleNextStep = async () => {
    let isValid = true;

    // Валидация в зависимости от текущего шага
    if (currentStep === 1) {
      // Валидация базовых данных
      isValid = await form.trigger("basic");
    } else if (currentStep === 2) {
      // Валидация специфичных для роли данных
      if (role === USER_ROLES.DOCTOR) {
        isValid = await form.trigger("doctor");
      } else if (role === USER_ROLES.CLINIC) {
        isValid = await form.trigger("clinic");
      }
    }

    // Переходим на следующий шаг только если валидация прошла
    if (isValid) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const openConsentModal = () => setShowConsentModal(true);
  const closeConsentModal = () => setShowConsentModal(false);

  const openPrivacyModal = () => {
    setShowConsentModal(false);
    setShowPrivacyModal(true);
  };

  const closePrivacyModal = () => setShowPrivacyModal(false);

  const acceptConsent = () => {
    setHasConsent(true);
    setShowConsentModal(false);
  };

  const onSubmit = async (data: SignUpFormData) => {

    if (!hasConsent) {
      setShowConsentModal(true);
      return;
    }

    setIsLoading(true);

    try {
      // Регистрация в Supabase Auth
      const signUpResult = await signUp({
        email: data.basic.email,
        password: data.basic.password,
        options: {
          data: {
            phone: data.basic.phone,
            full_name: data.basic.fullName,
          },
        },
      });

      if (!signUpResult) {
        toast.error("Ошибка при регистрации: функция signUp не вернула результат");
        setIsLoading(false);
        return;
      }

      const { data: authData, error: authError } = signUpResult;

      if (authError) {
        toast.error(authError.message || "Ошибка регистрации");
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        toast.error("Не удалось создать пользователя");
        setIsLoading(false);
        return;
      }

      try {
        // Передаём uploadedFiles для загрузки в Storage
        await createUser(authData.user.id, data, uploadedFiles);
      } catch (profileError: any) {
        console.error("Ошибка создания профиля:", profileError);

        // Показываем понятную ошибку
        const errorMessage = profileError?.message ||
          profileError?.error?.message ||
          "Ошибка создания профиля. Регистрация не завершена.";

        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Для doctor/clinic — отправляем заявку модераторам в Telegram
      if (data.role === USER_ROLES.DOCTOR || data.role === USER_ROLES.CLINIC) {
        try {
          // Получаем профиль с путями к файлам
          const profile = await getUser(authData.user.id);
          const documents =
            (profile as DoctorProfile | ClinicProfile).documents || null;

          let files: Array<{ name: string; url?: string }> = [];

          // Если есть пути к файлам, получаем signed URLs
          if (documents) {
            files = await getFileUrls(documents);
          } else {
            // Fallback: используем имена файлов из uploadedFiles
            const roleFiles = (uploadedFiles as any)?.[data.role] ?? {};
            files = Object.values(roleFiles).flatMap((value: any) => {
              if (!value) return [];
              if (Array.isArray(value)) return value.map((f) => ({ name: f?.name }));
              return [{ name: value?.name }];
            });
          }

          const { error: moderationError } = await requestModeration({
            profileId: authData.user.id,
            role: data.role,
            fullName: data.basic.fullName,
            email: data.basic.email,
            phone: data.basic.phone,
            files,
          });

          if (moderationError) {
            console.error("Ошибка отправки заявки на модерацию:", moderationError);
          }
        } catch (moderationErr) {
          console.error("Ошибка подготовки данных для модерации:", moderationErr);
        }
      }

      toast.success("Регистрация выполнена успешно");
      navigate(0);
    } catch (error) {
      toast.error("Произошла ошибка при регистрации");
      console.error("Ошибка регистрации:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
  };
};
