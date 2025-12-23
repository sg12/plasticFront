export interface FileValidationConfig {
  maxSize: number // в байтах
  allowedTypes: string[] // MIME типы
  maxFiles?: number // максимальное количество файлов (для множественной загрузки)
}

export type FileValidationErrorType = "size" | "type" | "count" | "corrupted" | "malicious"

export interface FileValidationError {
  type: FileValidationErrorType
  message: string
  fileName?: string
  name: string
}

export const createFileValidationError = (
  type: FileValidationErrorType,
  message: string,
  fileName?: string,
): FileValidationError => ({
  type,
  message,
  fileName,
  name: "FileValidationError",
})

// Для обратной совместимости с instanceof проверками
export const isFileValidationError = (error: any): error is FileValidationError => {
  return error && typeof error === "object" && error.name === "FileValidationError"
}

// Стандартные конфигурации для разных типов файлов
export const FILE_VALIDATION_CONFIGS = {
  // Документы (паспорта, дипломы, лицензии)
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 5,
  },

  // Изображения для AI обработки
  images: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
    maxFiles: 1,
  },

  // Общие документы клиники
  clinicDocuments: {
    maxSize: 15 * 1024 * 1024, // 15MB
    allowedTypes: [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxFiles: 10,
  },
}

/**
 * Валидирует размер файла
 */
export function validateFileSize(file: File, maxSize: number): void {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    const fileSizeMB = Math.round(file.size / (1024 * 1024))
    throw createFileValidationError(
      "size",
      `Файл "${file.name}" слишком большой (${fileSizeMB}MB). Максимальный размер: ${maxSizeMB}MB`,
      file.name,
    )
  }

  if (file.size === 0) {
    throw createFileValidationError("size", `Файл "${file.name}" пустой`, file.name)
  }
}

/**
 * Валидирует тип файла
 */
export function validateFileType(file: File, allowedTypes: string[]): void {
  if (!allowedTypes.includes(file.type)) {
    throw createFileValidationError(
      "type",
      `Тип файла "${file.name}" не поддерживается. Разрешены: ${allowedTypes.join(", ")}`,
      file.name,
    )
  }
}

/**
 * Валидирует расширение файла (дополнительная проверка)
 */
export function validateFileExtension(file: File, _allowedTypes: string[]): void {
  const fileName = file.name.toLowerCase()
  const fileExtension = fileName.split(".").pop()

  if (!fileExtension) {
    throw createFileValidationError("type", `Файл "${file.name}" не имеет расширения`, file.name)
  }

  // Проверяем соответствие расширения MIME типу
  const extensionToMime: Record<string, string[]> = {
    pdf: ["application/pdf"],
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    png: ["image/png"],
    webp: ["image/webp"],
    gif: ["image/gif"],
    doc: ["application/msword"],
    docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    xls: ["application/vnd.ms-excel"],
    xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  }

  const expectedMimeTypes = extensionToMime[fileExtension]
  if (expectedMimeTypes && !expectedMimeTypes.includes(file.type)) {
    throw createFileValidationError(
      "type",
      `Расширение файла "${file.name}" не соответствует его типу`,
      file.name,
    )
  }
}

/**
 * Проверяет файл на повреждение путем чтения первых байтов
 */
export async function validateFileIntegrity(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        // Для изображений проверяем заголовок
        if (file.type.startsWith("image/")) {
          const buffer = reader.result as ArrayBuffer
          const bytes = new Uint8Array(buffer.slice(0, 8))

          // JPEG: FF D8 FF
          if (
            file.type === "image/jpeg" &&
            !(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
          ) {
            throw createFileValidationError(
              "corrupted",
              `Файл "${file.name}" поврежден или не является JPEG изображением`,
              file.name,
            )
          }

          // PNG: 89 50 4E 47 0D 0A 1A 0A
          if (
            file.type === "image/png" &&
            !(bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
          ) {
            throw createFileValidationError(
              "corrupted",
              `Файл "${file.name}" поврежден или не является PNG изображением`,
              file.name,
            )
          }

          // WebP: 52 49 46 46 ... 57 45 42 50
          if (
            file.type === "image/webp" &&
            !(
              bytes[0] === 0x52 &&
              bytes[1] === 0x49 &&
              bytes[2] === 0x46 &&
              bytes[3] === 0x46 &&
              bytes[8] === 0x57 &&
              bytes[9] === 0x45 &&
              bytes[10] === 0x42 &&
              bytes[11] === 0x50
            )
          ) {
            throw createFileValidationError(
              "corrupted",
              `Файл "${file.name}" поврежден или не является WebP изображением`,
              file.name,
            )
          }
        }

        // Для PDF проверяем заголовок
        if (file.type === "application/pdf") {
          const buffer = reader.result as ArrayBuffer
          const bytes = new Uint8Array(buffer.slice(0, 4))
          if (!(bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)) {
            throw createFileValidationError(
              "corrupted",
              `Файл "${file.name}" поврежден или не является PDF документом`,
              file.name,
            )
          }
        }

        resolve()
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(
        createFileValidationError(
          "corrupted",
          `Не удалось прочитать файл "${file.name}"`,
          file.name,
        ),
      )
    }

    // Читаем только первые 8 байт для проверки
    const blob = file.slice(0, 8)
    reader.readAsArrayBuffer(blob)
  })
}

/**
 * Проверяет имя файла на потенциально опасные символы
 */
export function validateFileName(file: File): void {
  const fileName = file.name

  // Проверяем на опасные символы в имени файла
  const dangerousChars = /[<>:"\/\\|?*\x00-\x1f]/
  if (dangerousChars.test(fileName)) {
    throw createFileValidationError(
      "malicious",
      `Имя файла "${fileName}" содержит недопустимые символы`,
      fileName,
    )
  }

  // Проверяем на слишком длинное имя
  if (fileName.length > 255) {
    throw createFileValidationError(
      "malicious",
      `Имя файла "${fileName}" слишком длинное`,
      fileName,
    )
  }

  // Проверяем на подозрительные расширения
  const suspiciousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".pif",
    ".com",
    ".jar",
    ".js",
    ".vbs",
    ".hta",
  ]
  const fileNameLower = fileName.toLowerCase()
  for (const ext of suspiciousExtensions) {
    if (fileNameLower.endsWith(ext)) {
      throw createFileValidationError(
        "malicious",
        `Файл "${fileName}" имеет подозрительное расширение`,
        fileName,
      )
    }
  }
}

/**
 * Комплексная валидация файла
 */
export async function validateFile(file: File, config: FileValidationConfig): Promise<void> {
  // Проверяем имя файла
  validateFileName(file)

  // Проверяем размер
  validateFileSize(file, config.maxSize)

  // Проверяем тип
  validateFileType(file, config.allowedTypes)

  // Проверяем расширение
  validateFileExtension(file, config.allowedTypes)

  // Проверяем целостность файла
  await validateFileIntegrity(file)
}

/**
 * Валидирует массив файлов
 */
export async function validateFiles(files: File[], config: FileValidationConfig): Promise<void> {
  // Проверяем количество файлов
  if (config.maxFiles && files.length > config.maxFiles) {
    throw createFileValidationError(
      "count",
      `Слишком много файлов. Максимум: ${config.maxFiles}, получено: ${files.length}`,
    )
  }

  // Валидируем каждый файл
  for (const file of files) {
    await validateFile(file, config)
  }
}

/**
 * Безопасная функция для получения размера файла в человеко-читаемом формате
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Получает информацию о файле для отображения
 */
export function getFileInfo(file: File): {
  name: string
  size: string
  type: string
  lastModified: Date
} {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type || "Неизвестный тип",
    lastModified: new Date(file.lastModified),
  }
}
