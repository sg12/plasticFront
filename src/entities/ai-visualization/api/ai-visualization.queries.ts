import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteVisualization, getHistory, visualize } from "./ai-visualization.api"
import type { VisualizeAiDto } from "../model/ai-visualization.schema"
import { toast } from "sonner"
import { useVisualizerStore } from "../model/ai-visualization.store"

export const aiVisualizationKeys = {
  all: ["ai-visualization"] as const,
  list: () => [...aiVisualizationKeys.all, "list"] as const, // Better for lists
}

export const useAiVisualizationHistory = () => {
  return useQuery({
    queryKey: aiVisualizationKeys.list(),
    queryFn: getHistory,
    staleTime: 2 * 60 * 1000,
  })
}

export const useAiVisualize = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, visualizeAiDto }: { file: File; visualizeAiDto: VisualizeAiDto }) =>
      visualize(file, visualizeAiDto),
    onMutate: () => {
      toast.loading("ИИ обрабатывает ваше фото...", { id: "ai-processing" })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiVisualizationKeys.list() })
      toast.success("Визуализация готова!", { id: "ai-processing" })
      useVisualizerStore.setState({
        resultImage: data.url,
        step: "result",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Ошибка при генерации"
      toast.error(message, { id: "ai-processing" })

      useVisualizerStore.setState({
        step: "upload-photo",
      })
    },
  })
}

export const useDeleteVisualization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVisualization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiVisualizationKeys.list() })
      toast.success("Визуализация удалена")
    },
  })
}
