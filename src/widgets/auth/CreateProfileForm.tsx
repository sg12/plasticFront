import { useCreateProfileForm } from "@/features/user-management/profile/create/hooks/useCreateProfileForm"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { Button } from "@/shared/ui/button"
import { PatientForm } from "@/widgets/patient/PatientForm"
import { DoctorForm } from "@/widgets/roleForms/DoctorForm"
import { ClinicForm } from "@/widgets/clinic/ClinicForm"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { FileUpload } from "@/features/data-processing/file-upload/ui/FileUpload"
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/ui/card"
import { useIsMobile } from "@/shared/hooks/useMobile"

export const CreateProfileForm = () => {
  const {
    form,
    role,
    isLoading,
    currentStep,
    setCurrentStep,
    handleFileChange,
    uploadedFiles,
    onSubmit,
    FormProvider,
  } = useCreateProfileForm()

  const isMobile = useIsMobile()

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="flex min-h-screen items-center justify-center w-full"
      >
        <Card className="w-full max-w-xl max-md:h-full max-md:w-full max-md:border-0">
          <CardHeader>
            <CardTitle>Завершение регистрации</CardTitle>
            <CardDescription>
              Пожалуйста, заполните дополнительную информацию для завершения создания вашего
              профиля.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-child">
            {role === USER_ROLE.PATIENT && <PatientForm form={form} />}
            {role === USER_ROLE.DOCTOR &&
              (currentStep === 0 ? (
                <DoctorForm form={form} />
              ) : (
                <FileUpload
                  fileSlot={{
                    id: "doctorDocuments",
                    label: "Документы врача",
                    multiple: true,
                  }}
                  uploadedFiles={uploadedFiles[USER_ROLE.DOCTOR] || {}}
                  onFileChange={(e, key) => handleFileChange(USER_ROLE.DOCTOR, e, key as string)}
                />
              ))}
            {role === USER_ROLE.CLINIC &&
              (currentStep === 0 ? (
                <ClinicForm form={form} />
              ) : (
                <FileUpload
                  fileSlot={{
                    id: "clinicDocuments",
                    label: "Документы клиники",
                    multiple: true,
                  }}
                  uploadedFiles={uploadedFiles[USER_ROLE.CLINIC] || {}}
                  onFileChange={(e, key) => handleFileChange(USER_ROLE.CLINIC, e, key as string)}
                />
              ))}
          </CardContent>

          <CardFooter className="space-child grid">
            {role !== USER_ROLE.PATIENT ? (
              currentStep === 0 ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  size={isMobile ? "lg" : "md"}
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  Дальше <ChevronRightIcon />
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    size={isMobile ? "lg" : "md"}
                    onClick={() => setCurrentStep((s) => s - 1)}
                  >
                    <ChevronLeftIcon />
                    Назад
                  </Button>
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full"
                    size={isMobile ? "lg" : "md"}
                  >
                    {isLoading ? "Создание..." : "Создать профиль"}
                  </Button>
                </>
              )
            ) : (
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                size={isMobile ? "lg" : "md"}
                className="w-full"
              >
                {isLoading ? "Создание..." : "Создать профиль"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
