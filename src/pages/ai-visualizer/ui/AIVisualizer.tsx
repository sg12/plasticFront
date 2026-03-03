import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProcessingLoader } from "@/features/data-processing/processing-loader/ui/ProcessingLoader";
import { useVisualizerStore } from "@/entities/ai-visualization/model/ai-visualization.store";
import { TokenBadge } from "@/features/data-processing/ai-visualization/check-tokens/ui/TokenBadge";
import { GenerateButton } from "@/features/data-processing/ai-visualization/generate-button/ui/GenerateButton";
import { PhotoUploader } from "@/features/data-processing/ai-visualization/photo-uploader/ui/PhotoUploader";
import { BodySelector } from "@/features/data-processing/ai-visualization/body-selector/ui/BodySelector";
import { ResultComparison } from "@/features/data-processing/ai-visualization/result-comparison/ui/ResultComparison";

export const AIVisualizer = () => {
  const { step, setStep } = useVisualizerStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Визуализатор</h1>
        <div className="mt-4 flex justify-center"><TokenBadge /></div>
      </div>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          {step === "select-zone" && <BodySelector />}
          {step === "upload-photo" && <PhotoUploader />}
          {step === "processing" && <ProcessingLoader />}
          {step === "result" && <ResultComparison />}
        </CardContent>
      </Card>

      {step !== "processing" && step !== "result" && (
        <div className="mt-6 flex max-md:flex-col justify-between">
          <Button
            variant="secondary"
            disabled={step === "select-zone"}
            onClick={() => setStep("select-zone")}
            className="max-md:mb-6"
          >
            <ArrowLeft className="mr-2 size-4" /> Назад
          </Button>

          {step === "upload-photo" ? <GenerateButton /> : null}
        </div>
      )}
    </div>
  );
};