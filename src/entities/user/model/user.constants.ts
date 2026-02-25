export const USER_ROLE = {
  PATIENT: "PATIENT",
  DOCTOR: "DOCTOR",
  CLINIC: "CLINIC",
} as const

export const USER_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const

export const MODERATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  BANNED: "BANNED",
} as const

export const ROLE_LOCALES = {
  [USER_ROLE.PATIENT]: {
    ru: "Пациент",
  },
  [USER_ROLE.DOCTOR]: {
    ru: "Доктор",
  },
  [USER_ROLE.CLINIC]: {
    ru: "Клиника",
  },
} as const

export const GENDER_LOCALES = {
  [USER_GENDER.MALE]: {
    ru: "Мужчина",
  },
  [USER_GENDER.FEMALE]: {
    ru: "Женщина",
  },
} as const

export const MODERATION_STATUS_LOCALES = {
  [MODERATION_STATUS.APPROVED]: {
    ru: "Подтвержден",
  },
  [MODERATION_STATUS.PENDING]: {
    ru: "Ожидает",
  },
  [MODERATION_STATUS.REJECTED]: {
    ru: "Отклонено",
  },
  [MODERATION_STATUS.BANNED]: {
    ru: "Забанен",
  },
} as const
