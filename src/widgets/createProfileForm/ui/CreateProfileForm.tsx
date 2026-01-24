import { useCreateProfileForm } from "@/features/createProfile/hooks/useCreateProfileForm"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Button } from "@/shared/ui/button"
import { PatientForm } from "@/widgets/roleForms/PatientForm"
import { DoctorForm } from "@/widgets/roleForms/DoctorForm"
import { ClinicForm } from "@/widgets/roleForms/ClinicForm"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import type { ClinicUploadedFiles, DoctorUploadedFiles } from "@/entities/document/types/types"
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
    doctorFileSlots,
    clinicFileSlots,
    FormProvider,
    handleSaveClick,
  } = useCreateProfileForm()
  const isMobile = useIsMobile()

  return (
    <FormProvider {...form}>
      <form
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
            {role === USER_ROLES.PATIENT && <PatientForm form={form} />}
            {role === USER_ROLES.DOCTOR &&
              (currentStep === 0 ? (
                <DoctorForm form={form} />
              ) : (
                <FileUpload<DoctorUploadedFiles>
                  fileSlots={doctorFileSlots}
                  uploadedFiles={uploadedFiles.doctor || {}}
                  onFileChange={(e, key) => handleFileChange(USER_ROLES.DOCTOR, e, key)}
                />
              ))}
            {role === USER_ROLES.CLINIC &&
              (currentStep === 0 ? (
                <ClinicForm form={form} />
              ) : (
                <FileUpload<ClinicUploadedFiles>
                  fileSlots={clinicFileSlots}
                  uploadedFiles={uploadedFiles.clinic || {}}
                  onFileChange={(e, key) => handleFileChange(USER_ROLES.CLINIC, e, key)}
                />
              ))}
          </CardContent>

          <CardFooter className="space-child grid">
            {role !== USER_ROLES.PATIENT ? (
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
                    onClick={() => handleSaveClick()}
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
                onClick={() => handleSaveClick()}
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
