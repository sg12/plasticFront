import { useAiVisualize } from "@/entities/ai-visualization/api/ai-visualization.queries";
import { useVisualizerStore } from "@/entities/ai-visualization/model/ai-visualization.store";
import { Button } from "@/shared/ui/button";
import { Sparkles } from "lucide-react";

export const GenerateButton = () => {
  const {
    uploadedPhoto,
    zone,
    description,
    setStep,
    setResult
  } = useVisualizerStore();

  const { mutate, isPending } = useAiVisualize();

  const handleGenerate = () => {
    if (!uploadedPhoto || !zone || !description) return;

    setStep("processing");

    mutate(
      {
        file: uploadedPhoto,
        visualizeAiDto: { zone, description }
      },
      {
        onSuccess: (data) => {
          setResult(data.fileUrl || data.url);
        },
        onError: () => {
          setStep("upload-photo");
        }
      }
    );
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending || !uploadedPhoto || !description}
      className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-8"
    >
      {isPending ? "Обработка..." : (
        <>
          <Sparkles className="size-4" />
          Сгенерировать результат
        </>
      )}
    </Button>
  );
};