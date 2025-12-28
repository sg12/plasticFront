import { useState, useCallback } from "react"
import type { VisualizationState, BodyZone, VisualizationStep, OperationType } from "../types/types"

const initialState: VisualizationState = {
  step: "select-zone",
  selectedZone: null,
  uploadedPhoto: null,
  photoPreview: null,
  resultImage: null,
  intensity: 50,
  operationType: null,
  isProcessing: false,
  error: null,
}

export const useVisualization = () => {
  const [state, setState] = useState<VisualizationState>(initialState)

  const setStep = useCallback((step: VisualizationStep) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const selectZone = useCallback((zone: BodyZone) => {
    setState((prev) => ({ ...prev, selectedZone: zone }))
  }, [])

  const setPhoto = useCallback((file: File | null, preview: string | null) => {
    setState((prev) => ({
      ...prev,
      uploadedPhoto: file,
      photoPreview: preview,
    }))
  }, [])

  const setIntensity = useCallback((intensity: number) => {
    setState((prev) => ({ ...prev, intensity }))
  }, [])

  const setDescription = useCallback((description: string) => {
    setState((prev) => ({ ...prev, description }))
  }, [])

  const setOperationType = useCallback((operationType: OperationType | null) => {
    setState((prev) => ({ ...prev, operationType }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const startProcessing = useCallback(() => {
    setState((prev) => ({ ...prev, isProcessing: true, step: "processing" }))
  }, [])

  const completeProcessing = useCallback((resultImage: string) => {
    setState((prev) => ({
      ...prev,
      isProcessing: false,
      resultImage,
      step: "result",
    }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      switch (prev.step) {
        case "upload-photo":
          return { ...prev, step: "select-zone" }
        case "processing":
          return { ...prev, step: "upload-photo", isProcessing: false }
        case "result":
          return { ...prev, step: "upload-photo", resultImage: null }
        default:
          return prev
      }
    })
  }, [])

  const canProceed = useCallback(() => {
    switch (state.step) {
      case "select-zone":
        return state.selectedZone !== null
      case "upload-photo":
        return state.uploadedPhoto !== null
      default:
        return false
    }
  }, [state.step, state.selectedZone, state.uploadedPhoto])

  return {
    state,
    setStep,
    selectZone,
    setPhoto,
    setIntensity,
    setDescription,
    setOperationType,
    setError,
    startProcessing,
    completeProcessing,
    reset,
    goBack,
    canProceed,
  }
}
