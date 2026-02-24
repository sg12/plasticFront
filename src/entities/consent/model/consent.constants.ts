export const CONSENT_TYPE = {
  TERMS_OF_SERVICE: "TERMS_OF_SERVICE",
  PRIVACY_POLICY: "PRIVACY_POLICY",
  MEDICAL_DATA_PROCESSING: "MEDICAL_DATA_PROCESSING",
  MARKETING: "MARKETING",
} as const

export const CONSENT_TYPE_LOCALES = {
  [CONSENT_TYPE.TERMS_OF_SERVICE]: {
    ru: "Условия использования",
  },
  [CONSENT_TYPE.PRIVACY_POLICY]: {
    ru: "Политика конфиденциальности",
  },
  [CONSENT_TYPE.MEDICAL_DATA_PROCESSING]: {
    ru: "Обработка медицинских данных",
  },
  [CONSENT_TYPE.MARKETING]: {
    ru: "Маркетинговые рассылки",
  },
} as const

