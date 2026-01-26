import { useCallback, useState, useEffect } from "react"
import type { FileRecord, FileUploadProps } from "../types/types"
import { Upload, AlertCircle, X } from "lucide-react"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer"
import { useDropzone } from "react-dropzone"
import { FILE_ACCEPT_TYPES_OBJECT, MAX_FILE_SIZE } from "@/shared/model/constants"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { ScrollArea } from "@/shared/ui/scrollArea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { Item } from "@/shared/ui/item"

export const FileUpload = <T extends FileRecord>({
  fileSlot,
  onFileChange,
  uploadedFiles,
  disabled = false,
}: FileUploadProps<T>) => {
  const [validationErrors] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const slotId = String(fileSlot.id)

  useEffect(() => {
    const uploadedFile = uploadedFiles[slotId]
    if (uploadedFile) {
      setFiles(Array.isArray(uploadedFile) ? uploadedFile : [uploadedFile])
    }
  }, [uploadedFiles, slotId])

  const toggleFilesList = () => {
    setIsExpanded((prev) => !prev)
  }

  const notifyFileChange = useCallback(
    (newFiles: File[]) => {
      if (!onFileChange) return

      const dataTransfer = new DataTransfer()
      newFiles.forEach((file) => dataTransfer.items.add(file))
      const input = document.createElement("input")
      input.type = "file"
      input.files = dataTransfer.files

      const syntheticEvent = {
        target: input,
        currentTarget: input,
      } as React.ChangeEvent<HTMLInputElement>

      onFileChange(syntheticEvent, slotId as keyof T)
    },
    [onFileChange, slotId],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
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

          setFiles((prev) => {
            const newFiles = [...prev, ...acceptedFiles]
            notifyFileChange(newFiles)
            return newFiles
          })
        } catch (validationError) {
          if (isFileValidationError(validationError)) {
            setError(validationError.message)
          } else {
            setError("Ошибка валидации файла")
          }
        }
      }
    },
    [notifyFileChange],
  )

  const handleRemoveFile = (fileIndex: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, idx) => idx !== fileIndex)
      notifyFileChange(newFiles)
      return newFiles
    })
  }

  const getTotalSize = (slotFiles: File[]): number => {
    return slotFiles.reduce((total, file) => {
      const fileSize = file.size || 0
      return total + (isNaN(fileSize) ? 0 : fileSize)
    }, 0)
  }

  const totalSize = getTotalSize(files)
  const totalSizeMB = totalSize > 0 ? (totalSize / (1024 * 1024)).toFixed(2) : "0.00"
  const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
  const progressPercent = totalSize > 0 && MAX_FILE_SIZE > 0 ? (totalSize / MAX_FILE_SIZE) * 100 : 0

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILE_ACCEPT_TYPES_OBJECT,
    maxSize: MAX_FILE_SIZE,
    multiple: fileSlot.multiple !== false,
  })

  const triggerButton = (
    <Button variant="secondary" disabled={disabled} className="w-full" size={isMobile ? "lg" : "md"}>
      <Upload className="mr-2 size-4" />
      Загрузить файлы
      {files.length > 0 && (
        <Badge variant="primary" className="ml-2">
          {files.length}
        </Badge>
      )}
    </Button>
  )

  const content = (
    <div className="space-child max-md:p-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 p-6 text-center transition-all duration-200",
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
            <Upload className={cn("size-8", isDragActive ? "text-violet-600" : "text-gray-400")} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? "Отпустите файлы" : "Перетащите файлы сюда"}
            </p>
            <p className="mt-1 text-sm text-gray-500">или нажмите для выбора файлов</p>
          </div>
          <p className="text-xs text-gray-400">
            PDF, JPG, PNG до {maxSizeMB}MB {fileSlot.multiple !== false && "(можно несколько)"}
          </p>
        </div>
      </div>

      {files.length > 0 && (
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

      {files.length > 0 && (
        <Collapsible open={isExpanded} onOpenChange={toggleFilesList}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-900">
                Загруженные файлы ({files.length})
              </span>
              {isExpanded ? (
                <ChevronUp className="size-4 text-gray-500" />
              ) : (
                <ChevronDown className="size-4 text-gray-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="mt-2 max-h-[400px]">
              <div className="space-text">
                {files.map((file, index) => {
                  const fileInfo = getFileInfo(file)

                  return (
                    <Item
                      key={index}
                      variant="outline"
                    >
                      <div className="relative size-12 lg:size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <div className="flex h-full items-center justify-center">
                          {fileInfo.mime}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {fileInfo.name.substring(0, 20)}...
                        </p>
                        <p className="text-sm text-gray-500">{fileInfo.size}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => handleRemoveFile(index)}
                        className="shrink-0"
                      >
                        <X className="size-4" />
                      </Button>
                    </Item>
                  )
                })}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )

  return (
    <div className="space-global">
      <Label htmlFor={slotId} className="mb-2 block text-sm text-gray-700">
        {fileSlot.label}
      </Label>

      {isMobile ? (
        <Drawer open={openDialog} onOpenChange={setOpenDialog}>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
          <DrawerContent className="flex max-h-[90vh] flex-col">
            <DrawerHeader className="sr-only shrink-0">
              <DrawerTitle>Загрузка файлов</DrawerTitle>
              <DrawerDescription>Нажмите для выбора</DrawerDescription>
            </DrawerHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {content}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Загрузка файлов</DialogTitle>
              <DialogDescription>Перетащите файлы сюда или нажмите для выбора</DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}

      {validationErrors && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationErrors}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}