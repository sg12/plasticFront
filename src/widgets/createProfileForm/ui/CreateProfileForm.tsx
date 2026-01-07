import { useCreateProfileForm } from "@/features/createProfile/hooks/useCreateProfileForm"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Button } from "@/shared/ui/button"
import { PatientForm } from "@/widgets/roleForms/PatientForm"
import { DoctorForm } from "@/widgets/roleForms/DoctorForm"
import { ClinicForm } from "@/widgets/roleForms/ClinicForm"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import type { ClinicUploadedFiles, DoctorUploadedFiles } from "@/entities/document/types/types"

export const CreateProfileForm = () => {
  const {
    form,
    onSubmit,
    role,
    isLoading,
    currentStep,
    setCurrentStep,
    handleFileChange,
    uploadedFiles,
    doctorFileSlots,
    clinicFileSlots,
    FormProvider,
    handleSaveClick,
  } = useCreateProfileForm()

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h1 className="mb-2 text-gray-900">Завершение регистрации</h1>
                <p className="text-gray-600">
                  Пожалуйста, заполните дополнительную информацию для завершения создания вашего
                  профиля.
                </p>
              </div>

              {role === USER_ROLES.PATIENT && <PatientForm form={form} />}
              {role === USER_ROLES.DOCTOR &&
                (currentStep === 0 ? (
                  <DoctorForm form={form} />
                ) : (
                  <FileUpload<DoctorUploadedFiles>
                    fileSlots={doctorFileSlots}
                    uploadedFiles={uploadedFiles.doctor || {}}
                    onFileChange={(e, key) => handleFileChange("doctor", e, key)}
                  />
                ))}
              {role === USER_ROLES.CLINIC &&
                (currentStep === 0 ? (
                  <ClinicForm form={form} />
                ) : (
                  <FileUpload<ClinicUploadedFiles>
                    fileSlots={clinicFileSlots}
                    uploadedFiles={uploadedFiles.clinic || {}}
                    onFileChange={(e, key) => handleFileChange("clinic", e, key)}
                  />
                ))}

              {role !== USER_ROLES.PATIENT ? (
                currentStep === 0 ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setCurrentStep((s) => s + 1)}
                  >
                    Дальше <ChevronRightIcon />
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setCurrentStep((s) => s - 1)}
                    >
                      <ChevronLeftIcon />
                      Назад
                    </Button>
                    <Button
                      onClick={() => handleSaveClick()}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Создание..." : "Создать профиль"}
                    </Button>
                  </div>
                )
              ) : (
                <Button onClick={() => handleSaveClick()} disabled={isLoading} className="w-full">
                  {isLoading ? "Создание..." : "Создать профиль"}
                </Button>
              )}
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
