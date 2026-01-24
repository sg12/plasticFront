export const DAYS_OF_WEEK = [
  { value: 1, label: "Понедельник" },
  { value: 2, label: "Вторник" },
  { value: 3, label: "Среда" },
  { value: 4, label: "Четверг" },
  { value: 5, label: "Пятница" },
  { value: 6, label: "Суббота" },
  { value: 0, label: "Воскресенье" },
]

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
