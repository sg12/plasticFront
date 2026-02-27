import { useCallback } from "react"
import { useVisualization } from "@/features/aiVisualization/hooks/useVisualization"
import { BodySelector } from "@/widgets/ai-visualization/BodySelector"
import { PhotoUploader } from "@/features/aiVisualization/ui/PhotoUploader"
import { ProcessingLoader } from "@/features/data-processing/processing-loader/ui/ProcessingLoader"
import { ResultComparison } from "@/widgets/ai-visualization/ResultComparison"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { ArrowLeft, ArrowRight, Gem, Sparkles } from "lucide-react"
import { processFaceImageV2 } from "@/features/aiVisualization/api/apiV2"
import { useAuthStore } from "@/entities/auth/model/auth.store"
import { Badge } from "@/shared/ui/badge"
import { updateUser } from "@/entities/user/api/user.api"
import { cn } from "@/shared/lib/utils"
import { logger } from "@/shared/lib/logger"
import { useUserStore } from "@/entities/user/model/user.store"

export const AIVisualizer = () => {
  const { user } = useAuthStore()
  const { profile } = useUserStore()
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

        const result = await processFaceImageV2({
          image: state.uploadedPhoto,
          zone: state.selectedZone,
          operationType: state.operationType,
          description: state.description || undefined,
        })
        logger.debug("Обработка изображения через Face Image V2", {
          zone: state.selectedZone,
          operationType: state.operationType,
          description: state.description,
        })

        if (result) {
          completeProcessing(result.resultUrl)

          if (result && user?.id) {
            if (profile?.aiTokensUsed) {
              const decrementToken = profile?.aiTokensUsed - 1
              try {
                await updateUser(user.id, { aiTokenUsed: decrementToken })
                const { loadProfile } = useUserStore.getState()
                await loadProfile(user.id)
              } catch (error) {
                logger.error("Ошибка при сохранении токенов", error as Error, {
                  userId: user.id,
                  tokensUsed: decrementToken,
                })
              }
            }
          }
        }
      } catch (error) {
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
          {profile?.aiTokensUsed !== null && profile?.aiTokensUsed !== undefined && (
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant={profile.aiTokensUsed == 0 ? "outline" : "primary"} className="gap-2">
                <Gem className="size-3" />
                {profile.aiTokensUsed == 0
                  ? "Токены закончились"
                  : `Осталось токенов: ${profile.aiTokensUsed.toLocaleString()}`}
              </Badge>
            </div>
          )}
        </div>

        <Card>
          <CardContent
            className={cn(
              profile?.aiTokensUsed === 0 &&
              state.step !== "result" &&
              "pointer-events-none select-none",
            )}
          >
            <div className="relative">
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

              {profile?.aiTokensUsed === 0 && state.step !== "result" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-xs">
                  <div className="text-center">
                    <Gem className="mx-auto mb-3 size-12 text-violet-500" />
                    <h3>В скором времени добавим способ пополнять токены</h3>
                  </div>
                </div>
              )}
            </div>

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
              variant="secondary"
              onClick={() => goBack()}
              disabled={state.step === "select-zone"}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Назад
            </Button>

            <Button
              onClick={() => handleNext()}
              disabled={!canProceed(profile)}
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
