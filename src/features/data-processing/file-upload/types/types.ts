import type React from "react"

type FileValue = File | File[] | undefined

export type FileRecord = Record<string, FileValue>

export interface FileSlot {
  id: string
  label: string
  multiple?: boolean
}

export interface FileUploadProps<T extends FileRecord> {
  fileSlot: FileSlot
  uploadedFiles: T
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof T) => void
  disabled?: boolean
}
