import { supabase } from "@/shared/api/supabase/client"
import {
  validateFiles,
  FILE_VALIDATION_CONFIGS,
  isFileValidationError,
  type FileValidationConfig,
} from "@/shared/lib/fileValidation"
import { logger } from "@/shared/lib/logger"
import type { USER_ROLES } from "@/entities/user/model/constants"

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
  role: typeof USER_ROLES.DOCTOR | typeof USER_ROLES.CLINIC,
  files: any,
): Promise<UploadedFilePaths> {
  logger.info("Начало загрузки файлов", {
    userId,
    role,
    fileCount: Object.keys(files).length,
  })

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
        logger.error(`Валидация файла не пройдена для ${key}`, error as Error, {
          userId,
          role,
          documentType: key,
          fileName: (error as { fileName?: string }).fileName,
        })
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

        if (uploadError) {
          logger.error(`Ошибка загрузки файла для ${key}`, new Error(uploadError.message), {
            userId,
            role,
            documentType: key,
            filePath,
          })
          throw new Error(`Ошибка загрузки для ${key}: ${uploadError.message}`)
        }

        logger.debug("Файл успешно загружен", {
          userId,
          role,
          documentType: key,
          filePath,
        })
        uploadedPaths.push(filePath)
      }),
    )

    if (uploadedPaths.length > 0) {
      paths[key] = Array.isArray(fileOrFiles) ? uploadedPaths : uploadedPaths[0]
    }
  })

  await Promise.all(uploadPromises)

  logger.info("Все файлы успешно загружены", {
    userId,
    role,
    uploadedCount: Object.keys(paths).length,
  })

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
        logger.error(`Ошибка получения URL для файла`, new Error(error.message), {
          path,
          documentType: key,
        })
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
