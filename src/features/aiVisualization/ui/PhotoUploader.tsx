import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import type { BodyZone, OperationType } from "@/features/aiVisualization/types/types"
import { BODY_ZONES } from "@/features/aiVisualization/model/constants"
import { cn } from "@/shared/lib/utils"
import { Upload, X, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import {
  validateFile,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
} from "@/shared/lib/fileValidation"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radioGroup"
import { Textarea } from "@/shared/ui/textarea"
import { MAX_FILE_SIZE } from "@/entities/document/model/constants"

interface PhotoUploaderProps {
  selectedZone: BodyZone
  photo: File | null
  photoPreview: string | null
  intensity: number
  operationType: OperationType | null
  onPhotoChange: (file: File | null, preview: string | null) => void
  onIntensityChange: (value: number) => void
  onOperationTypeChange: (operationType: OperationType | null) => void
  onDescriptionChange: (description: string) => void
}

export const PhotoUploader = ({
  selectedZone,
  photo,
  photoPreview,
  operationType,
  onPhotoChange,
  onOperationTypeChange,
  onDescriptionChange,
}: PhotoUploaderProps) => {
  const [error, setError] = useState<string | null>(null)
  const zone = BODY_ZONES[selectedZone]
  const availableOperations = zone.operations || []
  const selectedOperation = operationType

  // Автоматически выбираем первую операцию, если не выбрана
  useEffect(() => {
    if (!operationType && availableOperations.length > 0) {
      onOperationTypeChange(availableOperations[0].id)
    }
  }, [operationType, availableOperations, onOperationTypeChange])

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("Файл слишком большой. Максимальный размер: 25MB")
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Неподдерживаемый формат. Используйте JPG, PNG или WebP")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        try {
          // Дополнительная валидация с помощью нашего модуля
          await validateFile(file, FILE_VALIDATION_CONFIGS.images)

          const reader = new FileReader()
          reader.onload = () => {
            onPhotoChange(file, reader.result as string)
          }
          reader.onerror = () => {
            setError("Ошибка чтения файла")
          }
          reader.readAsDataURL(file)
        } catch (validationError) {
          if (isFileValidationError(validationError)) {
            setError(validationError.message)
          } else {
            setError("Ошибка валидации файла")
          }
        }
      }
    },
    [onPhotoChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  })

  const handleRemovePhoto = () => {
    onPhotoChange(null, null)
    setError(null)
  }

  return (
    <div className="space-global">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Загрузите фото</h2>
        <p className="text-gray-500">
          Выбрана зона: <span className="font-medium text-violet-600">{zone.label}</span>
        </p>
      </div>

      <Alert className="border-violet-200 bg-violet-50">
        <Info className="size-4 text-violet-600" />
        <AlertDescription className="text-violet-700">{zone.photoTip}</AlertDescription>
      </Alert>

      {availableOperations.length > 0 && (
        <div className="space-child">
          <Label className="text-base font-semibold">Тип операции</Label>
          <RadioGroup
            value={selectedOperation || undefined}
            onValueChange={(value) => onOperationTypeChange(value as OperationType)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {availableOperations.map((operation) => (
              <div
                key={operation.id}
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-all",
                  selectedOperation === operation.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300",
                )}
              >
                <RadioGroupItem value={operation.id} id={operation.id} className="mt-1" />
                <label htmlFor={operation.id} className="flex-1 cursor-pointer">
                  <div className="font-medium text-gray-900">{operation.label}</div>
                  <div className="text-sm text-gray-500">{operation.description}</div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="space-child">
        <Label htmlFor="description" className="text-base font-semibold">
          Дополнительное описание (необязательно)
        </Label>
        <Textarea
          id="description"
          placeholder="Опишите желаемые изменения или особые требования к визуализации..."
          rows={4}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="resize-none"
        />
      </div>

      {!photoPreview ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200",
            isDragActive
              ? "border-violet-500 bg-violet-50"
              : "border-gray-300 hover:border-violet-400 hover:bg-violet-50/50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "rounded-full p-4 transition-colors",
                isDragActive ? "bg-violet-100" : "bg-gray-100",
              )}
            >
              <Upload
                className={cn("size-8", isDragActive ? "text-violet-600" : "text-gray-400")}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? "Отпустите файл" : "Перетащите фото сюда"}
              </p>
              <p className="mt-1 text-sm text-gray-500">или нажмите для выбора файла</p>
            </div>
            <p className="text-xs text-gray-400">JPG, PNG или WEBP до 10MB</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={photoPreview}
              alt="Предпросмотр"
              className="mx-auto h-auto max-h-[400px] w-full object-contain"
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">{photo?.name}</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
