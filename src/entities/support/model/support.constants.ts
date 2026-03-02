export const TICKET_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const

export const TICKET_STATUS_LOCALES = {
  [TICKET_STATUS.OPEN]: {
    ru: "Открыт",
  },
  [TICKET_STATUS.IN_PROGRESS]: {
    ru: "В работе",
  },
  [TICKET_STATUS.RESOLVED]: {
    ru: "Решен",
  },
  [TICKET_STATUS.CLOSED]: {
    ru: "Закрыт",
  },
} as const
