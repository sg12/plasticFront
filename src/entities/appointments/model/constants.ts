/**
 * @fileoverview Константы для работы с записями на приём
 *
 * @module entities/appointments/model/constants
 */

import type { AppointmentStatus, AppointmentType, DoctorScheduleDay } from "../types/types"

/**
 * Статусы записи на приём
 */
export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const

/**
 * Типы приёма
 */
export const APPOINTMENT_TYPE = {
  CONSULTATION: "consultation",
  PROCEDURE: "procedure",
  SURGERY: "surgery",
} as const

/**
 * Названия статусов для отображения
 */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.PENDING]: "Ожидает подтверждения",
  [APPOINTMENT_STATUS.CONFIRMED]: "Подтверждена",
  [APPOINTMENT_STATUS.CANCELLED]: "Отменена",
  [APPOINTMENT_STATUS.COMPLETED]: "Завершена",
} as const

/**
 * Названия типов приёма для отображения
 */
export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  [APPOINTMENT_TYPE.CONSULTATION]: "Консультация",
  // [APPOINTMENT_TYPE.PROCEDURE]: "Процедура",
  // [APPOINTMENT_TYPE.SURGERY]: "Операция",
} as const

/**
 * Длительность приёма по умолчанию (в минутах) для каждого типа
 */
export const DEFAULT_APPOINTMENT_DURATION: Record<AppointmentType, number> = {
  [APPOINTMENT_TYPE.CONSULTATION]: 30,
  // [APPOINTMENT_TYPE.PROCEDURE]: 60,
  // [APPOINTMENT_TYPE.SURGERY]: 120,
} as const

/**
 * Минимальное время до записи (в часах)
 * Пациент не может записаться на приём раньше, чем через это время
 */
export const MIN_HOURS_BEFORE_APPOINTMENT = 2

/**
 * Длительность временного слота по умолчанию (в минутах)
 */
export const DEFAULT_TIME_SLOT_DURATION = 30

/**
 * Минимальная длительность приёма (в минутах)
 */
export const MIN_APPOINTMENT_DURATION = 15

/**
 * Максимальная длительность приёма (в минутах)
 */
export const MAX_APPOINTMENT_DURATION = 480

/**
 * Названия таблиц в базе данных
 */
export const APPOINTMENTS_TABLE = "appointments"
export const DOCTOR_SCHEDULES_TABLE = "doctorSchedules"
export const TIME_SLOTS_TABLE = "timeSlots"

/**
 * Расписание по умолчанию для врача (вся неделя, кроме воскресенья)
 */
export const DEFAULT_DOCTOR_SCHEDULE: DoctorScheduleDay[] = [
  { dayOfWeek: 1, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
  { dayOfWeek: 2, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
  { dayOfWeek: 3, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
  { dayOfWeek: 4, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
  { dayOfWeek: 5, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
  { dayOfWeek: 6, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
]
