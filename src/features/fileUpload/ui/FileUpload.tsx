import React, { useState } from "react"
import type { FileRecord, FileUploadProps } from "../types/types"
import { Check, ChevronsUpDown, Upload, AlertCircle } from "lucide-react"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible"
import { FILE_ACCEPT_TYPES } from "@/entities/document/model/constants"
import {
  validateFiles,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
} from "@/shared/lib/fileValidation"
import { Alert, AlertDescription } from "@/shared/ui/alert"

export const FileUpload = <T extends FileRecord>({
  fileSlots,
  onFileChange,
  uploadedFiles,
  disabled = false,
  ...props
}: FileUploadProps<T>) => {
  const [openSlots, setOpenSlots] = React.useState<Set<string>>(new Set())
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const toggleSlot = (slotId: keyof T) => {
    setOpenSlots((prev) => {
      const next = new Set(prev)
      next.has(String(slotId)) ? next.delete(String(slotId)) : next.add(String(slotId))
      return next
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof T) => {
    const files = Array.from(e.target.files || [])
    const slotId = String(fileType)

    // Очищаем предыдущие ошибки для этого слота
    setValidationErrors((prev) => ({ ...prev, [slotId]: "" }))

    if (files.length === 0) {
      onFileChange(e, fileType as keyof T)
      return
    }

    try {
      // Валидируем файлы - используем стандартные конфигурации
      const config = FILE_VALIDATION_CONFIGS.documents // Используем документы по умолчанию
      await validateFiles(files, config)

      // Если валидация прошла успешно, передаем файлы дальше
      onFileChange(e, fileType as keyof T)
    } catch (error) {
      if (isFileValidationError(error)) {
        setValidationErrors((prev) => ({ ...prev, [slotId]: error.message }))
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          [slotId]: "Произошла ошибка при валидации файла",
        }))
      }
      // Очищаем выбранные файлы при ошибке
      e.target.value = ""
    }
  }

  return (
    <div className="space-global">
      {fileSlots.map((slot) => {
        const isSlotOpen = openSlots.has(slot.id as string)
        const slotFiles = uploadedFiles[slot.id]
        const fileCount = Array.isArray(slotFiles) ? slotFiles : slotFiles ? [slotFiles] : []
        return (
          <div key={String(slot.id)}>
            <Label htmlFor={String(slot.id)} className="mb-2 block text-sm text-gray-700">
              {slot.label}
            </Label>
            <div className="relative">
              <Upload className="absolute top-1/2 left-4 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="file"
                id={String(slot.id)}
                name={slot.label}
                multiple={slot.multiple}
                onChange={(e) => handleFileChange(e, slot.id)}
                accept={FILE_ACCEPT_TYPES}
                disabled={disabled}
                {...props}
              />
            </div>

            {/* Отображение ошибок валидации */}
            {validationErrors[String(slot.id)] && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationErrors[String(slot.id)]}</AlertDescription>
              </Alert>
            )}

            {slotFiles &&
              (fileCount.length > 1 ? null : (
                <Collapsible open={isSlotOpen} onOpenChange={() => toggleSlot(slot.id as keyof T)}>
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="mt-2 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800"
                      aria-expanded={isSlotOpen}
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                      <span>{isSlotOpen ? "Скрыть" : "Показать"} загруженные файлы</span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2">
                      {fileCount.map((file, idx) => (
                        <p key={idx} className="flex items-center gap-2 text-sm text-green-600">
                          <Check size={16} />
                          {file.name}
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        )
      })}
    </div>
  )
}
