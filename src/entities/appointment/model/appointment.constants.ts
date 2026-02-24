export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
  NO_SHOW: "NO_SHOW",
} as const

export const APPOINTMENT_TYPE = {
  OFFLINE: "OFFLINE",
  ONLINE: "ONLINE",
  HOME_VISIT: "HOME_VISIT",
} as const

export const APPOINTMENT_STATUS_LOCALES = {
  [APPOINTMENT_STATUS.PENDING]: {
    ru: "Ожидает подтверждения",
  },
  [APPOINTMENT_STATUS.CONFIRMED]: {
    ru: "Подтверждена",
  },
  [APPOINTMENT_STATUS.CANCELED]: {
    ru: "Отменена",
  },
  [APPOINTMENT_STATUS.COMPLETED]: {
    ru: "Завершена",
  },
  [APPOINTMENT_STATUS.NO_SHOW]: {
    ru: "Пациент не пришёл",
  },
} as const

export const APPOINTMENT_TYPE_LOCALES = {
  [APPOINTMENT_TYPE.ONLINE]: {
    ru: "Онлайн",
  },
  [APPOINTMENT_TYPE.OFFLINE]: {
    ru: "Оффлайн",
  },
  [APPOINTMENT_TYPE.HOME_VISIT]: {
    ru: "Дома",
  },
} as const
