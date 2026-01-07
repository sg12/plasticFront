import { useCallback } from "react"
import { useVisualization } from "@/features/aiVisualization/hooks/useVisualization"
import { processFaceImage } from "@/features/aiVisualization/api/api"
import { BodySelector } from "@/widgets/bodySelector/ui/BodySelector"
import { PhotoUploader } from "@/features/aiVisualization/ui/PhotoUploader"
import { ProcessingLoader } from "@/features/processingLoader/ui/ProcessingLoader"
import { ResultComparison } from "@/widgets/resultComparison/ui/ResultComparison"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { AI_VISUALIZER_STEPS } from "../../../features/aiVisualization/model/constants"
import { StepIndicator } from '@/shared/ui/stepIndicator'

export const AIVisualizer = () => {
  const {
    state,
    setStep,
    selectZone,
    setPhoto,
    setIntensity,
    setDescription,
    setOperationType,
    startProcessing,
    completeProcessing,
    reset,
    goBack,
    canProceed,
  } = useVisualization()

  const handleNext = useCallback(async () => {
    if (state.step === "select-zone" && state.selectedZone) {
      setStep("upload-photo")
    } else if (state.step === "upload-photo" && state.uploadedPhoto) {
      startProcessing()

      try {
        // Проверяем, что выбранная зона поддерживается для обработки лица
        const faceZones: Array<"nose" | "eyes" | "lips" | "cheeks" | "chin" | "forehead" | "ears"> =
          ["nose", "eyes", "lips", "cheeks", "chin", "forehead", "ears"]

        if (!state.selectedZone || !faceZones.includes(state.selectedZone as any)) {
          throw new Error(
            "Выбранная зона не поддерживается для обработки лица. Пожалуйста, выберите зону лица.",
          )
        }

        const result = await processFaceImage({
          image: state.uploadedPhoto,
          zone: state.selectedZone,
          operationType: state.operationType,
          intensity: state.intensity,
        })
        completeProcessing(result.resultUrl)
      } catch (error) {
        console.error("AI processing error:", error)
        const errorMessage =
          error instanceof Error ? error.message : "Произошла ошибка при обработке изображения"
        alert(errorMessage)
        goBack()
      }
    }
  }, [
    state.step,
    state.selectedZone,
    state.uploadedPhoto,
    state.intensity,
    state.operationType,
    setStep,
    startProcessing,
    completeProcessing,
    goBack,
  ])

  return (
    <div className="min-h-full px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
            <Sparkles className="size-4" />
            Визуализатор
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Посмотрите на себя после операции
          </h1>
          <p className="mx-auto max-w-xl text-gray-500">
            Визуализатор покажет, как вы можете выглядеть после пластической операции. Выберите
            зону, загрузите фото и получите визуализацию за секунды.
          </p>
        </div>

        {AI_VISUALIZER_STEPS.length > 1 && (
          <StepIndicator steps={AI_VISUALIZER_STEPS} currentStep={state.step} />
        )}

        <Card>
          <CardContent className="p-6 md:p-8">
            {state.step === "select-zone" && (
              <BodySelector selectedZone={state.selectedZone} onSelectZone={selectZone} />
            )}

            {state.step === "upload-photo" && state.selectedZone && (
              <PhotoUploader
                selectedZone={state.selectedZone}
                photo={state.uploadedPhoto}
                photoPreview={state.photoPreview}
                intensity={state.intensity}
                operationType={state.operationType}
                onPhotoChange={setPhoto}
                onIntensityChange={setIntensity}
                onOperationTypeChange={setOperationType}
                onDescriptionChange={setDescription}
              />
            )}

            {state.step === "processing" && <ProcessingLoader />}

            {state.step === "result" &&
              state.selectedZone &&
              state.photoPreview &&
              state.resultImage && (
                <ResultComparison
                  selectedZone={state.selectedZone}
                  originalImage={state.photoPreview}
                  resultImage={state.resultImage}
                  onReset={reset}
                />
              )}
          </CardContent>
        </Card>

        {state.step !== "processing" && state.step !== "result" && (
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => goBack()}
              disabled={state.step === "select-zone"}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Назад
            </Button>

            <Button
              onClick={() => handleNext()}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {state.step === "upload-photo" ? (
                <>
                  <Sparkles className="size-4" />
                  Сгенерировать
                </>
              ) : (
                <>
                  Далее
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
