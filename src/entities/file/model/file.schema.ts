import { z } from "zod"
import { FILE_ACCEPT_TYPES_STRING, MAX_FILE_SIZE } from "./file.constants"

export const FILE_VALIDATION_CONFIGS = {
  files: {
    maxSize: MAX_FILE_SIZE,
    allowedTypes: FILE_ACCEPT_TYPES_STRING,
    maxFiles: 5,
  },
} as const

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: "Файл не должен быть пустым" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `Размер файла не должен превышать ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  })

export const filesSchema = z.array(fileSchema).superRefine((files, ctx) => {
  // Проверка количества файлов
  if (files.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Выберите хотя бы один файл",
    })
    return
  }

  // Проверка максимального количества файлов
  const maxFiles = FILE_VALIDATION_CONFIGS.files.maxFiles
  if (files.length > maxFiles) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Можно загрузить не более ${maxFiles} файлов`,
    })
  }

  // Проверка типов файлов
  const allowedTypes = FILE_VALIDATION_CONFIGS.files.allowedTypes
  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index],
        message: `Тип файла не поддерживается. Разрешены: ${allowedTypes}`,
      })
    }
  })
})
