export const AUTH_TYPE = {
  USER: "USER",
  STAFF: "STAFF",
} as const

export const AUTH_TYPE_LOCALES = {
  [AUTH_TYPE.USER]: {
    ru: "Пользователь",
  },
  [AUTH_TYPE.STAFF]: {
    ru: "Модератор",
  },
} as const
