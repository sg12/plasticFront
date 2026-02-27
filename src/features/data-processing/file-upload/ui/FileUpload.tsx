import { useCallback, useState, useEffect } from "react"
import { Upload, AlertCircle, X, ChevronDown, ChevronUp } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Label } from "@/shared/ui/label"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shared/ui/drawer"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { Badge } from "@/shared/ui/badge"
import { ScrollArea } from "@/shared/ui/scrollArea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"
import { Item } from "@/shared/ui/item"

import { cn, formatFileSize } from "@/shared/lib/utils"
import { useIsMobile } from "@/shared/hooks/useMobile"

import type { FileRecord, FileUploadProps } from "../types/types"
import { filesSchema } from "@/entities/file/model/file.schema"
import { FILE_ACCEPT_TYPES_OBJECT, MAX_FILE_SIZE } from "@/entities/file/model/file.constants"

const getFileInfo = (file: File) => ({
  name: file.name,
  size: formatFileSize(file.size),
  mime: file.type.split("/")[1]?.toUpperCase() || "FILE"
})

export const FileUpload = <T extends FileRecord>({
  fileSlot,
  onFileChange,
  uploadedFiles,
  disabled = false,
}: FileUploadProps<T>) => {
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const slotId = String(fileSlot.id)

  useEffect(() => {
    const uploadedFile = uploadedFiles[slotId]
    if (uploadedFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiles(Array.isArray(uploadedFile) ? uploadedFile : [uploadedFile])
    } else {
      setFiles([])
    }
  }, [uploadedFiles, slotId])

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        const errorCode = rejection.errors[0]?.code
        if (errorCode === "file-too-large") {
          setError(`Файл слишком большой. Максимум: ${formatFileSize(MAX_FILE_SIZE)}`)
        } else if (errorCode === "file-invalid-type") {
          setError("Неподдерживаемый формат файла")
        } else {
          setError("Ошибка при выборе файла")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const newFilesList = fileSlot.multiple ? [...files, ...acceptedFiles] : [acceptedFiles[0]]

        const validation = filesSchema.safeParse(newFilesList)

        if (!validation.success) {
          setError(validation.error.message)
          return
        }

        setFiles(newFilesList)
        notifyFileChange(newFilesList)
      }
    },
    [files, fileSlot.multiple, notifyFileChange],
  )

  const handleRemoveFile = (fileIndex: number) => {
    const newFiles = files.filter((_, idx) => idx !== fileIndex)
    setFiles(newFiles)
    notifyFileChange(newFiles)
    if (newFiles.length === 0) setIsExpanded(false)
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)
  const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
  const progressPercent = Math.min((totalSize / MAX_FILE_SIZE) * 100, 100)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILE_ACCEPT_TYPES_OBJECT,
    maxSize: MAX_FILE_SIZE,
    multiple: fileSlot.multiple,
    disabled
  })

  const triggerButton = (
    <Button variant="secondary" disabled={disabled} className="w-full justify-between" size="lg">
      <span className="flex items-center">
        <Upload className="mr-2 size-4" />
        {files.length > 0 ? "Файлы выбраны" : "Загрузить файлы"}
      </span>
      {files.length > 0 && (
        <Badge variant="secondary" className="ml-2">
          {files.length}
        </Badge>
      )}
    </Button>
  )

  const content = (
    <div className="space-y-4 p-1">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={cn("size-10", isDragActive ? "text-primary" : "text-muted-foreground")} />
          <p className="text-base font-medium">
            {isDragActive ? "Бросайте файлы" : "Нажмите или перетащите"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG до {maxSizeMB}MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Занято: {totalSizeMB}MB / {maxSizeMB}MB</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2">
              <span className="text-sm">Список файлов ({files.length})</span>
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="h-48 pr-3">
              <div className="space-y-2 pt-2">
                {files.map((file, index) => {
                  const info = getFileInfo(file)
                  return (
                    <Item key={`${file.name}-${index}`} className="flex items-center gap-3 p-2 border rounded-md">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold">
                        {info.mime}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{info.name}</p>
                        <p className="text-xs text-muted-foreground">{info.size}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="iconMd"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
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
    <div className="w-full">
      <Label className="mb-2 block text-sm font-semibold">{fileSlot.label}</Label>

      {isMobile ? (
        <Drawer open={openDialog} onOpenChange={setOpenDialog}>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Загрузка документов</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">{content}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{fileSlot.label}</DialogTitle>
              <DialogDescription>Выберите файлы для загрузки</DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}