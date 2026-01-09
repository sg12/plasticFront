import type { ContactMethod, WorkingHours } from "../types/types"

export const CONTACT_METHODS: ContactMethod[] = [
  {
    type: "email",
    label: "Email",
    value: "support@novome.ru",
    icon: "Mail",
  },
  {
    type: "phone",
    label: "Телефон",
    value: "+7 (999) 123-45-67",
    icon: "Phone",
  },
  {
    type: "telegram",
    label: "Telegram",
    value: "@novome_support",
    icon: "MessageCircle",
  },
]

export const WORKING_HOURS: WorkingHours = {
  days: ["Понедельник - Пятница", "Суббота - Воскресенье"],
  hours: ["09:00 - 18:00", "10:00 - 18:00"],
}

export const SUPPORT_TICKET_STATUSES = {
  open: "Открыто",
  in_progress: "В работе",
  resolved: "Решено",
  closed: "Закрыто",
} as const

export const SUPPORT_TICKET_PRIORITIES = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  urgent: "Срочный",
} as const
