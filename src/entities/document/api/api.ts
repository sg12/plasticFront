import { supabase } from "@/shared/api/supabase/client"
import type { DoctorUploadedFiles, ClinicUploadedFiles } from "../types/types"
import {
  validateFiles,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
  type FileValidationConfig,
} from "@/shared/lib/fileValidation"

const STORAGE_BUCKET = "documents"

type UploadedFilePaths = {
  [key: string]: string | string[]
}

// Конфигурации валидации для разных типов документов
const DOCUMENT_VALIDATION_CONFIGS: Record<string, FileValidationConfig> = {
  diploma: FILE_VALIDATION_CONFIGS.documents,
  license: FILE_VALIDATION_CONFIGS.documents,
  certificate: FILE_VALIDATION_CONFIGS.documents,
  clinicDocuments: FILE_VALIDATION_CONFIGS.clinicDocuments,
}

export async function uploadFiles(
  userId: string,
  role: "doctor" | "clinic",
  files: DoctorUploadedFiles | ClinicUploadedFiles,
): Promise<UploadedFilePaths> {
  const paths: UploadedFilePaths = {}

  const uploadPromises = Object.entries(files).map(async ([key, fileOrFiles]) => {
    if (!fileOrFiles) return

    const filesArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles]
    const validFiles = filesArray.filter((file) => file instanceof File) as File[]
    if (validFiles.length === 0) return

    // Валидируем файлы перед загрузкой
    const config = DOCUMENT_VALIDATION_CONFIGS[key] || FILE_VALIDATION_CONFIGS.documents
    try {
      await validateFiles(validFiles, config)
    } catch (error) {
      if (isFileValidationError(error)) {
        console.error(`Валидация файла не пройдена для ${key}:`, error.message)
        throw new Error(`Ошибка валидации файла "${error.fileName}": ${error.message}`)
      }
      throw error
    }

    const uploadedPaths: string[] = []

    await Promise.all(
      validFiles.map(async (file) => {
        const fileExt = file.name.split(".").pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${userId}/${role}/${key}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, { cacheControl: "3600", upsert: false })

        if (uploadError) throw new Error(`Ошибка загрузки для ${key}: ${uploadError.message}`)

        uploadedPaths.push(filePath)
      }),
    )

    if (uploadedPaths.length > 0) {
      paths[key] = Array.isArray(fileOrFiles) ? uploadedPaths : uploadedPaths[0]
    }
  })

  await Promise.all(uploadPromises)

  return paths
}

export async function getFileUrls(
  filePaths: UploadedFilePaths,
): Promise<Array<{ name: string; url: string }>> {
  const urls: Array<{ name: string; url: string }> = []

  for (const [key, pathOrPaths] of Object.entries(filePaths)) {
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]

    for (const path of paths) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(path, 3600) // URL действителен 1 час

      if (error) {
        console.error(`Ошибка получения URL для ${path}:`, error)
        continue
      }

      if (data?.signedUrl) {
        urls.push({
          name: key,
          url: data.signedUrl,
        })
      }
    }
  }

  return urls
}
