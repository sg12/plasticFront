export const REVIEW_STATUS = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const

export const REVIEW_STATUS_LOCALES = {
  [REVIEW_STATUS.APPROVED]: {
    ru: "Отзыв подтвержден",
  },
  [REVIEW_STATUS.PENDING]: {
    ru: "Отзыв ожидает",
  },
  [REVIEW_STATUS.REJECTED]: {
    ru: "Отзыв отклонен",
  },
  [REVIEW_STATUS.ARCHIVED]: {
    ru: "Отзыв архивирован",
  },
} as const
