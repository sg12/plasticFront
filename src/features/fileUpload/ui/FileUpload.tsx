import React, { useCallback, useState } from "react"
import type { FileRecord, FileUploadProps } from "../types/types"
import { Upload, AlertCircle, X, FileIcon } from "lucide-react"
import { Label } from "@/shared/ui/label"
import {
  validateFiles,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
  formatFileSize,
  getFileInfo,
} from "@/shared/lib/fileValidation"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { useDropzone } from "react-dropzone"
import { FILE_ACCEPT_TYPES_OBJECT, MAX_FILE_SIZE } from "@/shared/model/constants"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { ScrollArea } from "@/shared/ui/scrollArea"

export const FileUpload = <T extends FileRecord>({
  fileSlots,
  onFileChange,
  uploadedFiles: _uploadedFiles,
  disabled = false,
}: FileUploadProps<T>) => {
  const [validationErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({})
  const [files, setFiles] = useState<Record<string, File[]>>({})

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[], slotId: string) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`Файл слишком большой. Максимальный размер: ${formatFileSize(MAX_FILE_SIZE)}`)
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Неподдерживаемый формат файла")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        try {
          const config = FILE_VALIDATION_CONFIGS.documents
          await validateFiles(acceptedFiles, config)

          setFiles((prev) => ({
            ...prev,
            [slotId]: [...(prev[slotId] || []), ...acceptedFiles],
          }))
        } catch (validationError) {
          if (isFileValidationError(validationError)) {
            setError(validationError.message)
          } else {
            setError("Ошибка валидации файла")
          }
        }
      }
    },
    [],
  )

  const handleRemoveFile = (slotId: string, fileIndex: number) => {
    setFiles((prev) => {
      const slotFiles = prev[slotId] || []
      const newFiles = slotFiles.filter((_, idx) => idx !== fileIndex)
      return {
        ...prev,
        [slotId]: newFiles,
      }
    })
  }

  const handleSave = (slotId: string) => {
    const slotFiles = files[slotId] || []
    if (slotFiles.length > 0) {
      const dataTransfer = new DataTransfer()
      slotFiles.forEach((file) => dataTransfer.items.add(file))
      const input = document.createElement("input")
      input.files = dataTransfer.files

      const syntheticEvent = {
        target: input,
      } as React.ChangeEvent<HTMLInputElement>

      onFileChange(syntheticEvent, slotId as keyof T)
      setOpenDialog((prev) => ({ ...prev, [slotId]: false }))
    }
  }

  const getTotalSize = (slotFiles: File[]): number => {
    return slotFiles.reduce((total, file) => {
      const fileSize = file.size || 0
      return total + (isNaN(fileSize) ? 0 : fileSize)
    }, 0)
  }

  return (
    <div className="space-global">
      {fileSlots.map((slot) => {
        const slotId = String(slot.id)
        const slotFiles = files[slotId] || []
        const isOpen = openDialog[slotId] || false
        const totalSize = getTotalSize(slotFiles)
        const totalSizeMB = totalSize > 0 ? (totalSize / (1024 * 1024)).toFixed(2) : "0.00"
        const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
        const progressPercent = totalSize > 0 && MAX_FILE_SIZE > 0 ? (totalSize / MAX_FILE_SIZE) * 100 : 0

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: (accepted, rejected) => onDrop(accepted, rejected, slotId),
          accept: FILE_ACCEPT_TYPES_OBJECT,
          maxSize: MAX_FILE_SIZE,
          multiple: slot.multiple !== false,
        })

        return (
          <div key={slotId}>
            <Label htmlFor={slotId} className="mb-2 block text-sm text-gray-700">
              {slot.label}
            </Label>

            <Dialog open={isOpen} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, [slotId]: open }))}>
              <DialogTrigger asChild>
                <Button variant="secondary" disabled={disabled}>
                  <Upload className="mr-2 size-4" />
                  Загрузить файлы
                  {slotFiles.length > 0 && (
                    <Badge variant="primary" className="ml-2">
                      {slotFiles.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>

              <DialogContent  className="h-dvh no-scrollbar overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Загрузка файлов</DialogTitle>
                  <DialogDescription>
                    Перетащите файлы сюда или нажмите для выбора. Максимальный размер: {maxSizeMB}MB
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
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
                          {isDragActive ? "Отпустите файлы" : "Перетащите файлы сюда"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">или нажмите для выбора файлов</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF, JPG, PNG до {maxSizeMB}MB {slot.multiple !== false && "(можно несколько)"}
                      </p>
                    </div>
                  </div>

                  {slotFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Использовано: {totalSizeMB}MB из {maxSizeMB}MB
                        </span>
                        <span className="text-gray-500">
                          {isNaN(progressPercent) ? "0" : Math.min(progressPercent, 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={isNaN(progressPercent) ? 0 : Math.min(progressPercent, 100)}
                        className="h-2"
                      />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {slotFiles.length > 0 && (
                    <ScrollArea className="max-h-[400px]">
                      <div className="space-y-3">
                        {slotFiles.map((file, index) => {
                          const fileInfo = getFileInfo(file)

                          return (
                            <div
                              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                            >
                              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <div className="flex h-full items-center justify-center">
                                  {fileInfo.mime}
                                </div>
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900">{fileInfo.name}</p>
                                <p className="text-sm text-gray-500">{fileInfo.size}</p>
                              </div>

                              <Button
                                variant="ghost"
                                size="iconSm"
                                onClick={() => handleRemoveFile(slotId, index)}
                                className="shrink-0"
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpenDialog((prev) => ({ ...prev, [slotId]: false }))}>
                    Отмена
                  </Button>
                  <Button onClick={() => handleSave(slotId)} disabled={slotFiles.length === 0}>
                    Сохранить ({slotFiles.length})
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {validationErrors[slotId] && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationErrors[slotId]}</AlertDescription>
              </Alert>
            )}
          </div>
        )
      })}
    </div>
  )
}
