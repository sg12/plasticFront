export type BodyZone =
  | "nose"
  | "lips"
  | "eyes"
  | "chin"
  | "cheeks"
  | "forehead"
  | "ears"
  | "breast"
  | "abdomen"
  | "buttocks"
  | "thighs"
  | "arms"

export type BodyCategory = "face" | "body"

// Типы операций для разных зон
export type NoseOperationType = "reduce" | "refine" | "straighten" | "lift-tip"
export type LipsOperationType = "increase" | "reduce" | "reshape"
export type EyesOperationType = "upper-lift" | "lower-lift" | "widen"
export type ChinOperationType = "reduce" | "augment" | "reshape"
export type CheeksOperationType = "augment" | "reduce" | "lift"
export type ForeheadOperationType = "smooth" | "lift" | "reduce"
export type EarsOperationType = "pin-back" | "reduce" | "reshape"

export type OperationType =
  | NoseOperationType
  | LipsOperationType
  | EyesOperationType
  | ChinOperationType
  | CheeksOperationType
  | ForeheadOperationType
  | EarsOperationType

export interface OperationOption {
  id: OperationType
  label: string
  description: string
}

export interface BodyZoneConfig {
  id: BodyZone
  label: string
  description: string
  category: BodyCategory
  procedureName: string
  photoTip: string
  operations?: OperationOption[]
}

export type VisualizationStep = "select-zone" | "upload-photo" | "processing" | "result"

export interface VisualizationState {
  step: VisualizationStep
  selectedZone: BodyZone | null
  uploadedPhoto: File | null
  photoPreview: string | null
  resultImage: string | null
  intensity: number
  operationType: OperationType | null
  isProcessing: boolean
  error: string | null
}

export interface VisualizationResult {
  originalUrl: string
  resultUrl: string
  processingTime: number
  watermarked: boolean
}
