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
