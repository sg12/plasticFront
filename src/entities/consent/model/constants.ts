import type { ConsentType } from "@/entities/consent/types/types"

export const CONSENT_TYPES: Record<
  ConsentType,
  { title: string; description: string; isRequired: boolean }
> = {
  personalData: {
    title: "Обработка персональных данных",
    description: "ФИО, email, телефон, дата рождения",
    isRequired: true,
  },
  medicalData: {
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
} as const
