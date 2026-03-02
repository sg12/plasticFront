import type { FILE_TYPE } from "../model/file.constants"

export interface File {
  id: string
  patientId: string | null
  doctorId: string | null
  clinicId: string | null
  type: FILE_TYPE
  originalName: string
  mimeType: string
  size: number
  s3Key: string
  url: string
  createdAt: string
}

export type FILE_TYPE = keyof typeof FILE_TYPE
