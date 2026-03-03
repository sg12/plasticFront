import { create } from "zustand"
import type { Step, VisualizerState } from "../types/ai-visualization.types"

interface VisualizerActions {
  setStep: (step: Step) => void
  setZone: (zone: string) => void
  setPhoto: (file: File | null, preview: string | null) => void
  setResult: (url: string) => void
  setDescription: (description: string) => void
  reset: () => void
}

export const useVisualizerStore = create<VisualizerState & VisualizerActions>((set) => ({
  step: "select-zone",
  zone: null,
  uploadedPhoto: null,
  photoPreview: null,
  resultImage: null,
  description: "",

  setStep: (step) => set({ step }),
  setZone: (zone) => set({ zone: zone, step: "upload-photo" }),
  setPhoto: (file, preview) => set({ uploadedPhoto: file, photoPreview: preview }),
  setResult: (url) => set({ resultImage: url, step: "result" }),
  setDescription: (description) => set({ description }),
  reset: () => set({ step: "select-zone", zone: null, resultImage: null, uploadedPhoto: null }),
}))
