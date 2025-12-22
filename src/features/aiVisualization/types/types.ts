export type BodyZone = 
  | 'nose'
  | 'lips'
  | 'eyes'
  | 'chin'
  | 'cheeks'
  | 'forehead'
  | 'ears'
  | 'breast'
  | 'abdomen'
  | 'buttocks'
  | 'thighs'
  | 'arms';

export type BodyCategory = 'face' | 'body';

export interface BodyZoneConfig {
  id: BodyZone;
  label: string;
  description: string;
  category: BodyCategory;
  procedureName: string;
  photoTip: string;
}

export type VisualizationStep = 'select-zone' | 'upload-photo' | 'processing' | 'result';

export interface VisualizationState {
  step: VisualizationStep;
  selectedZone: BodyZone | null;
  uploadedPhoto: File | null;
  photoPreview: string | null;
  resultImage: string | null;
  intensity: number;
  isProcessing: boolean;
  error: string | null;
}

export interface VisualizationResult {
  originalUrl: string;
  resultUrl: string;
  processingTime: number;
  watermarked: boolean;
}

