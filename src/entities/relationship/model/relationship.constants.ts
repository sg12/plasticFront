export const RELATIONSHIP_STATUS = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const

export const RELATIONSHIP_STATUS_LOCALES = {
  [RELATIONSHIP_STATUS.APPROVED]: {
    ru: "Связь подтверждена",
  },
  [RELATIONSHIP_STATUS.PENDING]: {
    ru: "Связь ожидает",
  },
  [RELATIONSHIP_STATUS.REJECTED]: {
    ru: "Связь отменена",
  },
  [RELATIONSHIP_STATUS.ARCHIVED]: {
    ru: "Связь архивирована",
  },
} as const
