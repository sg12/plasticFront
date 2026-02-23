import type { createAppointmentSchema, updateAppointmentSchema } from "../model/appointment.schema"
import type z from "zod"

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"
export type AppointmentType = "consultation" // "procedure" | "surgery"

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  appointmentId?: string | null
}

export interface TimeRange {
  startTime: string
  endTime: string
}

/**
 * Расписание врача на день недели
 */
export interface DoctorScheduleDay {
  /** День недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота) */
  dayOfWeek: number
  /** Временные диапазоны работы */
  timeRanges: TimeRange[]
  /** Доступен ли этот день для записи */
  isAvailable: boolean
  /** @deprecated Используйте timeRanges. Время начала работы (формат HH:mm) */
  startTime?: string
  /** @deprecated Используйте timeRanges. Время окончания работы (формат HH:mm) */
  endTime?: string
}

/**
 * Полное расписание врача
 */
export interface DoctorSchedule {
  /** ID врача */
  doctorId: string
  /** Расписание по дням недели */
  schedule: DoctorScheduleDay[]
  /** Длительность одного приёма в минутах (по умолчанию) */
  defaultDuration: number
  /** Минимальное время до записи в часах */
  minHoursBeforeAppointment: number
}

/**
 * Основная модель записи на приём
 */
export interface Appointment {
  /** Уникальный идентификатор записи */
  id: string
  /** ID пациента */
  patientId: string
  /** ID врача (может быть null, если запись на клинику) */
  doctorId: string | null
  /** ID клиники (может быть null, если запись напрямую к врачу) */
  clinicId: string | null
  /** Тип приёма */
  type: AppointmentType
  /** Статус записи */
  status: AppointmentStatus
  /** Дата и время приёма (ISO строка) */
  dateTime: string
  /** Длительность приёма в минутах */
  duration: number
  /** Причина обращения (опционально) */
  reason: string | null
  /** Комментарии/пожелания (опционально) */
  notes: string | null
  /** Контактный телефон (если отличается от профиля) */
  contactPhone: string | null
  /** Дата создания записи (ISO строка) */
  createdAt: string
  /** Дата последнего обновления (ISO строка) */
  updatedAt: string
  /** Дата отмены (если запись отменена) */
  cancelledAt: string | null
  /** Дата завершения приёма (если приём завершён) */
  completedAt: string | null
}

/**
 * Расширенная модель записи с информацией о связанных пользователях
 */
export interface AppointmentWithDetails extends Appointment {
  /** Информация о пациенте */
  patient?: {
    id: string
    fullName: string | null
    phone: string | null
    email: string
  }
  /** Информация о враче (если есть) */
  doctor?: {
    id: string
    fullName: string | null
    specialization: string
    phone: string | null
  } | null
  /** Информация о клинике (если есть) */
  clinic?: {
    id: string
    legalName: string
    actualAddress: string | null
    phone: string | null
  } | null
}

/**
 * Данные для создания новой записи
 */
export type AppointmentCreateData = z.infer<typeof createAppointmentSchema>

/**
 * Данные для обновления записи
 */
export type AppointmentUpdateData = z.infer<typeof updateAppointmentSchema>

/**
 * Параметры фильтрации записей
 */
export interface AppointmentFilters {
  /** Фильтр по статусу */
  status?: AppointmentStatus | AppointmentStatus[]
  /** Фильтр по типу приёма */
  type?: AppointmentType | AppointmentType[]
  /** Фильтр по дате начала (ISO строка) */
  dateFrom?: string
  /** Фильтр по дате окончания (ISO строка) */
  dateTo?: string
  /** Фильтр по ID пациента */
  patientId?: string
  /** Фильтр по ID врача */
  doctorId?: string
  /** Фильтр по ID клиники */
  clinicId?: string
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  /** Номер страницы (начинается с 1) */
  page?: number
  /** Количество элементов на странице */
  limit?: number
}

/**
 * Результат запроса с пагинацией
 */
export interface PaginatedAppointments {
  /** Список записей */
  appointments: Appointment[]
  /** Общее количество записей */
  total: number
  /** Номер текущей страницы */
  page: number
  /** Количество элементов на странице */
  limit: number
  /** Общее количество страниц */
  totalPages: number
}
