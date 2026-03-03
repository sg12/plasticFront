export type Step = "select-zone" | "upload-photo" | "processing" | "result"

export interface VisualizerState {
  step: Step
  zone: string | null
  uploadedPhoto: File | null
  photoPreview: string | null
  resultImage: string | null
  description: string
}
