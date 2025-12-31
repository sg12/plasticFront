import { AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { useSignUpForm } from "@/features/signUp/hooks/useSignUpForm"
import { StepIndicator } from "@/shared/ui/StepIndicator"
import { ConsentModal } from "@/widgets/consentModal/ui/ConsentModal"
import { PrivacyModal } from "@/widgets/privacyModal/ui/PrivacyModal"
import { RoleSelector } from "@/widgets/roleSelector/ui/RoleSelector"
import { BasicInfoStep } from "./basicInfoStep/BasicInfoStep"
import { DoctorInfoStep } from "./doctorInfoStep/DoctorInfoStep"
import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import { ClinicInfoStep } from "./clinicInfoStep/ClinicInfoStep"
import { ConsentSection } from "@/widgets/consentSection/ui/ConsentSection"
import { NavLink } from "react-router-dom"
import { Button } from "@/shared/ui/button"
import type { FileSlot } from "@/features/fileUpload/types/types"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Separator } from "@/shared/ui/separator"
import { FormProvider } from "react-hook-form"
import type { ClinicUploadedFiles, DoctorUploadedFiles } from "@/entities/document/types/types"
import { FILE_ACCEPT_TYPES } from "@/entities/document/model/constants"
import { SIGNUP_STEPS_BY_ROLE } from "@/features/signUp/model/constants"

export function SignUpForm() {
  const {
    form,

    role,
    currentStep,
    uploadedFiles,

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
  } = useSignUpForm()

  const totalSteps = role === USER_ROLES.PATIENT ? 1 : 3

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

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="mb-2 text-gray-900">Регистрация</h2>
                <p className="text-gray-600">
                  {currentStep === 0 ? "Выберите тип аккаунта" : "Создайте новый аккаунт"}
                </p>
              </div>

              {showConsentModal && (
                <ConsentModal
                  userRole={role}
                  onAccept={acceptConsent}
                  onDecline={closeConsentModal}
                  onShowPrivacyModal={openPrivacyModal}
                />
              )}

              {showPrivacyModal && <PrivacyModal onClose={closePrivacyModal} />}

              {currentStep === 0 && (
                <RoleSelector
                  onRoleSelect={(role) => {
                    form.setValue("role", role)
                    handleNextStep()
                  }}
                />
              )}

              {currentStep > 0 && (
                <>
                  {SIGNUP_STEPS_BY_ROLE[role].length > 1 && (
                    <StepIndicator steps={SIGNUP_STEPS_BY_ROLE[role]} currentStep={currentStep} />
                  )}

                  {(role === USER_ROLES.DOCTOR || role === USER_ROLES.CLINIC) && (
                    <Alert variant="warning" className="mb-6">
                      <AlertCircle />
                      <AlertTitle>
                        <strong>Требуется модерация</strong>
                      </AlertTitle>
                      <AlertDescription>
                        Регистрация {role === USER_ROLES.DOCTOR ? "врачей" : "клиник"} требует
                        проверки модераторами. После отправки заявки вы получите уведомление на
                        email в течение 1-3 рабочих дней.
                      </AlertDescription>
                    </Alert>
                  )}

                  {currentStep === 1 && <BasicInfoStep />}

                  {/* Шаг 2: Профессиональные данные для врачей */}
                  {role === USER_ROLES.DOCTOR && currentStep === 2 && <DoctorInfoStep />}

                  {/* Шаг 3: Документы для врачей */}
                  {role === USER_ROLES.DOCTOR && currentStep === 3 && (
                    <Alert variant="info" className="mb-6">
                      <AlertCircle />
                      <AlertTitle>
                        <strong>Загрузите скан-копии или фотографии документов</strong>
                      </AlertTitle>
                      <AlertDescription>Доступный формат {FILE_ACCEPT_TYPES}</AlertDescription>
                    </Alert>
                  )}

                  {/* Шаг 3: Документы для врачей */}
                  {role === USER_ROLES.DOCTOR && currentStep === 3 && (
                    <FileUpload<DoctorUploadedFiles>
                      fileSlots={doctorFileSlots}
                      uploadedFiles={uploadedFiles.doctor || {}}
                      onFileChange={(e, key) => handleFileChange("doctor", e, key)}
                    />
                  )}

                  {/* Шаг 2: Данные организации для клиник */}
                  {role === USER_ROLES.CLINIC && currentStep === 2 && <ClinicInfoStep />}

                  {/* Шаг 3: Руководитель и документы для клиник */}
                  {role === USER_ROLES.CLINIC && currentStep === 3 && (
                    <FileUpload<ClinicUploadedFiles>
                      fileSlots={clinicFileSlots}
                      uploadedFiles={uploadedFiles.clinic || {}}
                      onFileChange={(e, key) => handleFileChange("clinic", e, key)}
                    />
                  )}

                  {currentStep === totalSteps && (
                    <ConsentSection
                      hasConsent={hasConsent}
                      onShowConsentModal={openConsentModal}
                      userRole={role}
                    />
                  )}

                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handlePrevStep}
                        className="flex-1"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        Назад
                      </Button>
                    )}

                    {currentStep < totalSteps ? (
                      <Button type="button" onClick={handleNextStep} className="flex-1">
                        Далее
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button type="submit" className="flex-1">
                        Зарегистрироваться
                      </Button>
                    )}
                  </div>
                </>
              )}
              <Separator className="relative inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-gray-500">или</span>
              </Separator>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Уже есть аккаунт?{" "}
                  <NavLink to="/signin" className="text-purple-600 hover:text-purple-700">
                    Войти
                  </NavLink>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2025 Агрегатор пластических услуг</p>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
