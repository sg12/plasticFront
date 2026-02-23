/**
 * @fileoverview Zod схемы для валидации данных записей на приём
 *
 * @module entities/appointments/model/schema
 */

import { z } from "zod"
import {
  APPOINTMENT_TYPE,
  APPOINTMENT_STATUS,
  MIN_APPOINTMENT_DURATION,
  MAX_APPOINTMENT_DURATION,
  MIN_HOURS_BEFORE_APPOINTMENT,
} from "./appointment.constants"

/**
 * Схема для создания записи на приём
 */
export const createAppointmentSchema = z
  .object({
    /** ID врача (обязателен, если не указана клиника) */
    doctorId: z.uuid("Неверный формат UUID врача").nullable().optional(),
    /** ID клиники (обязателен, если не указан врач) */
    clinicId: z.uuid("Неверный формат UUID клиники").nullable().optional(),
    /** Тип приёма */
    type: z.enum(
      [APPOINTMENT_TYPE.CONSULTATION], // APPOINTMENT_TYPE.PROCEDURE, APPOINTMENT_TYPE.SURGERY
      { message: "Выберите тип приёма" },
    ),
    /** Дата и время приёма */
    dateTime: z.iso
      .datetime("Неверный формат даты и времени")
      .refine(
        (dateTime) => {
          const appointmentDate = new Date(dateTime)
          const now = new Date()
          const minDate = new Date(now.getTime() + MIN_HOURS_BEFORE_APPOINTMENT * 60 * 60 * 1000)
          return appointmentDate >= minDate
        },
        {
          message: `Запись возможна минимум за ${MIN_HOURS_BEFORE_APPOINTMENT} часа до приёма`,
        },
      )
      .refine(
        (dateTime) => {
          const appointmentDate = new Date(dateTime)
          const now = new Date()
          return appointmentDate > now
        },
        {
          message: "Дата приёма должна быть в будущем",
        },
      ),
    /** Длительность приёма в минутах */
    duration: z
      .number()
      .min(MIN_APPOINTMENT_DURATION, `Минимальная длительность ${MIN_APPOINTMENT_DURATION} минут`)
      .max(MAX_APPOINTMENT_DURATION, `Максимальная длительность ${MAX_APPOINTMENT_DURATION} минут`)
      .optional(),
    /** Причина обращения */
    reason: z.string().max(500, "Причина обращения слишком длинная").optional().nullable(),
    /** Комментарии/пожелания */
    notes: z.string().max(1000, "Комментарий слишком длинный").optional().nullable(),
    /** Контактный телефон (если отличается от профиля) */
    contactPhone: z
      .string()
      .min(10, "Неверный номер телефона")
      .max(20, "Номер телефона слишком длинный")
      .optional()
      .nullable(),
  })
  .refine((data) => data.doctorId || data.clinicId, {
    message: "Необходимо указать либо врача, либо клинику",
    path: ["doctorId"],
  })

/**
 * Схема для обновления записи на приём
 */
export const updateAppointmentSchema = z.object({
  /** Новый статус записи */
  status: z
    .enum(
      [
        APPOINTMENT_STATUS.PENDING,
        APPOINTMENT_STATUS.CONFIRMED,
        APPOINTMENT_STATUS.CANCELLED,
        APPOINTMENT_STATUS.COMPLETED,
      ],
      { message: "Неверный статус записи" },
    )
    .optional(),
  /** Новая дата и время приёма */
  dateTime: z
    .date("Неверный формат даты и времени")
    .refine(
      (dateTime) => {
        const appointmentDate = new Date(dateTime)
        const now = new Date()
        return appointmentDate > now
      },
      {
        message: "Дата приёма должна быть в будущем",
      },
    )
    .optional(),
  /** Новая длительность приёма в минутах */
  duration: z
    .number()
    .min(MIN_APPOINTMENT_DURATION, `Минимальная длительность ${MIN_APPOINTMENT_DURATION} минут`)
    .max(MAX_APPOINTMENT_DURATION, `Максимальная длительность ${MAX_APPOINTMENT_DURATION} минут`)
    .optional(),
  /** Обновлённая причина обращения */
  reason: z.string().max(500, "Причина обращения слишком длинная").optional().nullable(),
  /** Обновлённые комментарии/пожелания */
  notes: z.string().max(1000, "Комментарий слишком длинный").optional().nullable(),
})

/**
 * Схема для временного диапазона
 */
const timeRangeSchema = z.object({
  /** Время начала (формат HH:mm) */
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Неверный формат времени"),
  /** Время окончания (формат HH:mm) */
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Неверный формат времени"),
})

/**
 * Схема для расписания врача
 */
export const doctorScheduleSchema = z.object({
  /** День недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота) */
  dayOfWeek: z.number().min(0).max(6),
  /** Временные диапазоны работы */
  timeRanges: z.array(timeRangeSchema).min(1, "Укажите хотя бы один временной диапазон"),
  /** Доступен ли этот день для записи */
  isAvailable: z.boolean(),
})

/**
 * Схема для полного расписания врача
 */
export const fullDoctorScheduleSchema = z.object({
  /** ID врача */
  doctorId: z.uuid("Неверный формат UUID врача"),
  /** Расписание по дням недели */
  schedule: z.array(doctorScheduleSchema).min(1, "Укажите хотя бы один рабочий день"),
  /** Длительность одного приёма в минутах (по умолчанию) */
  defaultDuration: z.number().min(MIN_APPOINTMENT_DURATION).max(MAX_APPOINTMENT_DURATION),
  /** Минимальное время до записи в часах */
  minHoursBeforeAppointment: z.number().min(0),
})
