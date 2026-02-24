export const BREAK_TYPE = {
  VACATION: "VACATION",
  SICK_LEAVE: "SICK_LEAVE",
  OTHER: "OTHER",
} as const

export const RULE_TYPE = {
  LUNCH: "LUNCH",
} as const

export const SLOT_STATUS = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  LOCKED: "LOCKED",
  CANCELED: "CANCELED",
} as const

export const BREAK_TYPE_LOCALES = {
  [BREAK_TYPE.VACATION]: {
    ru: "Отпуск",
  },
  [BREAK_TYPE.SICK_LEAVE]: {
    ru: "По болезни",
  },
  [BREAK_TYPE.OTHER]: {
    ru: "Другое",
  },
}

export const RULE_TYPE_LOCALES = {
  [RULE_TYPE.LUNCH]: {
    ru: "Обед",
  },
}

export const SLOT_STATUS_LOCALES = {
  [SLOT_STATUS.AVAILABLE]: {
    ru: "Доступно",
  },
  [SLOT_STATUS.BOOKED]: {
    ru: "Забронированно",
  },
  [SLOT_STATUS.CANCELED]: {
    ru: "Отменено",
  },
  [SLOT_STATUS.LOCKED]: {
    ru: "Закрыто",
  },
}
