import type React from "react"

type FileValue = File | File[] | undefined

export type FileRecord = Record<string, FileValue>

export interface FileSlot<T extends FileRecord> {
  id: keyof T
  label: string
  multiple?: boolean
}

export interface FileUploadProps<T extends FileRecord> {
  fileSlots: readonly FileSlot<T>[]
  uploadedFiles: T
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof T) => void
  disabled?: boolean
}
