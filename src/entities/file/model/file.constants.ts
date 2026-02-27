export const FILE_TYPE = {
  DOCUMENT: "DOCUMENT",
  AI_RESULT: "AI_RESULT",
  OTHER: "OTHER",
} as const

export const FILE_TYPE_LOCALES = {
  [FILE_TYPE.DOCUMENT]: {
    ru: "Документ",
  },
  [FILE_TYPE.AI_RESULT]: {
    ru: "Результаты ИИ визуализации",
  },
  [FILE_TYPE.OTHER]: {
    ru: "Другое",
  },
}

export const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export const FILE_ACCEPT_TYPES_STRING = "application/pdf, image/jpeg, image/jpg, image/png"
export const IMAGE_ACCEPT_TYPES_STRING = "image/jpeg, image/jpg, image/png, image/webp"

export const IMAGE_ACCEPT_TYPES_OBJECT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
} as const

export const FILE_ACCEPT_TYPES_OBJECT = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
} as const
