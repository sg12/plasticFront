export interface Consent {
  id: string
  type: ConsentType
  title: string
  description: string
  isActive: boolean
  grantedAt: string | null
  revokedAt: string | null
  isRequired: boolean // Обязательное согласие нельзя отозвать без удаления аккаунта
}

export type ConsentType = "personal_data" | "medical_data" | "marketing" | "analytics"

export const CONSENT_TYPES: Record<ConsentType, { title: string; description: string; isRequired: boolean }> = {
  personal_data: {
    title: "Обработка персональных данных",
    description: "ФИО, email, телефон, дата рождения",
    isRequired: true,
  },
  medical_data: {
    title: "Медицинские данные (специальная категория)",
    description: "История процедур, фото до/после, информация о здоровье",
    isRequired: false,
  },
  marketing: {
    title: "Маркетинговые коммуникации",
    description: "Рассылки, акции, персональные предложения",
    isRequired: false,
  },
  analytics: {
    title: "Аналитика использования",
    description: "Статистика посещений, улучшение сервиса",
    isRequired: false,
  },
}

