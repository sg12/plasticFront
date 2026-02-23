/**
 * @fileoverview API методы для работы с записями на приём
 *
 * @module entities/appointments/api/api
 */

import { supabase } from "@/shared/api/supabase/client"
import type {
  Appointment,
  AppointmentWithDetails,
  AppointmentCreateData,
  AppointmentUpdateData,
  AppointmentFilters,
  PaginationParams,
  PaginatedAppointments,
  TimeSlot,
  DoctorSchedule,
  DoctorScheduleDay,
} from "../types/appointment.types"
import { logger } from "@/shared/lib/logger"
import type { User } from "@supabase/supabase-js"
import {
  APPOINTMENTS_TABLE,
  DOCTOR_SCHEDULES_TABLE,
  DEFAULT_APPOINTMENT_DURATION,
  MIN_HOURS_BEFORE_APPOINTMENT,
  DEFAULT_TIME_SLOT_DURATION,
  DEFAULT_DOCTOR_SCHEDULE,
} from "../model/constants"
import {
  createAppointmentCreatedNotification,
  createAppointmentConfirmedNotification,
  createAppointmentCancelledNotification,
  createAppointmentCompletedNotification,
} from "@/entities/notification/utils/helpers"

/**
 * Создание новой записи на приём
 */
export const createAppointment = async (
  patientId: User["id"],
  data: AppointmentCreateData,
): Promise<Appointment> => {
  logger.info("Создание записи на приём", {
    patientId,
    doctorId: data.doctorId,
    clinicId: data.clinicId,
    type: data.type,
    dateTime: data.dateTime,
  })

  // Проверяем, что указан либо врач, либо клиника
  if (!data.doctorId && !data.clinicId) {
    throw new Error("Необходимо указать либо врача, либо клинику")
  }

  // Определяем длительность приёма
  const duration = data.duration || DEFAULT_APPOINTMENT_DURATION[data.type]

  // Создаём запись в БД
  const { data: appointment, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .insert({
      patientId,
      doctorId: data.doctorId || null,
      clinicId: data.clinicId || null,
      type: data.type,
      status: "pending",
      dateTime: data.dateTime,
      duration,
      reason: data.reason || null,
      notes: data.notes || null,
      contactPhone: data.contactPhone || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      throw new Error(
        "Ошибка доступа. Убедитесь, что вы авторизованы и RLS политики настроены правильно.",
      )
    }
    logger.error("Ошибка создания записи", new Error(error.message), {
      patientId,
      doctorId: data.doctorId,
      clinicId: data.clinicId,
    })
    throw error
  }

  if (!appointment) {
    logger.error("Не удалось создать запись", new Error("No data returned"), {
      patientId,
    })
    throw new Error("Не удалось создать запись")
  }

  logger.info("Запись успешно создана", {
    patientId,
    appointmentId: appointment.id,
  })

  // Создаём уведомления
  try {
    // Получаем информацию о враче/клинике для уведомления
    let doctorName: string | null = null
    let clinicName: string | null = null

    if (appointment.doctorId) {
      const { data: doctorProfile } = await supabase
        .from("profiles")
        .select("fullName")
        .eq("id", appointment.doctorId)
        .single()
      doctorName = doctorProfile?.fullName || null
    }

    if (appointment.clinicId) {
      const { data: clinicProfile } = await supabase
        .from("clinicProfiles")
        .select("legalName")
        .eq("id", appointment.clinicId)
        .single()
      clinicName = clinicProfile?.legalName || null
    }

    // Уведомление пациенту
    await createAppointmentCreatedNotification(
      patientId,
      appointment.id,
      appointment.dateTime,
      doctorName,
      clinicName,
    ).catch((error) => {
      logger.error("Ошибка создания уведомления пациенту", error as Error, {
        patientId,
        appointmentId: appointment.id,
      })
    })

    // Уведомление врачу/клинике
    const recipientId = appointment.doctorId || appointment.clinicId
    if (recipientId) {
      await createAppointmentCreatedNotification(
        recipientId,
        appointment.id,
        appointment.dateTime,
        null,
        null,
      ).catch((error) => {
        logger.error("Ошибка создания уведомления врачу/клинике", error as Error, {
          recipientId,
          appointmentId: appointment.id,
        })
      })
    }
  } catch (error) {
    // Логируем ошибку, но не прерываем выполнение
    logger.error("Ошибка при создании уведомлений о записи", error as Error, {
      appointmentId: appointment.id,
    })
  }

  return appointment
}

/**
 * Получение списка записей с фильтрацией и пагинацией
 */
export const getAppointments = async (
  filters: AppointmentFilters = {},
  pagination: PaginationParams = {},
): Promise<PaginatedAppointments> => {
  const { page = 1, limit = 20 } = pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from(APPOINTMENTS_TABLE).select("*", { count: "exact" })

  // Применяем фильтры
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status)
    } else {
      query = query.eq("status", filters.status)
    }
  }

  if (filters.type) {
    if (Array.isArray(filters.type)) {
      query = query.in("type", filters.type)
    } else {
      query = query.eq("type", filters.type)
    }
  }

  if (filters.patientId) {
    query = query.eq("patientId", filters.patientId)
  }

  if (filters.doctorId) {
    query = query.eq("doctorId", filters.doctorId)
  }

  if (filters.clinicId) {
    query = query.eq("clinicId", filters.clinicId)
  }

  if (filters.dateFrom) {
    query = query.gte("dateTime", filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte("dateTime", filters.dateTo)
  }

  // Сортировка по дате (сначала ближайшие)
  query = query.order("dateTime", { ascending: true })

  // Применяем пагинацию
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    logger.error("Ошибка получения записей", new Error(error.message), {
      filters,
      pagination,
    })
    throw error
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    appointments: (data as Appointment[]) || [],
    total,
    page,
    limit,
    totalPages,
  }
}

/**
 * Получение записи по ID с деталями
 */
export const getAppointmentById = async (
  appointmentId: string,
): Promise<AppointmentWithDetails | null> => {
  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .select(
      `
      *,
      patient:profiles!appointments_patientId_fkey(id, fullName, phone, email),
      doctor:profiles!appointments_doctorId_fkey(id, fullName, phone, doctorProfiles(specialization)),
      clinic:profiles!appointments_clinicId_fkey(id, fullName, phone, clinicProfiles(legalName, actualAddress))
    `,
    )
    .eq("id", appointmentId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Запись не найдена
      return null
    }
    logger.error("Ошибка получения записи", new Error(error.message), {
      appointmentId,
    })
    throw error
  }

  if (!data) {
    return null
  }

  // Формируем объект с деталями
  const doctorProfile = data.doctor?.doctorProfiles
  const doctorProfileData = Array.isArray(doctorProfile) ? doctorProfile[0] : doctorProfile

  const clinicProfile = data.clinic?.clinicProfiles
  const clinicProfileData = Array.isArray(clinicProfile) ? clinicProfile[0] : clinicProfile

  const appointment: AppointmentWithDetails = {
    ...(data as Appointment),
    patient: data.patient
      ? {
          id: data.patient.id,
          fullName: data.patient.fullName,
          phone: data.patient.phone,
          email: data.patient.email,
        }
      : undefined,
    doctor:
      data.doctor && doctorProfileData
        ? {
            id: data.doctor.id,
            fullName: data.doctor.fullName,
            specialization: doctorProfileData.specialization,
            phone: data.doctor.phone,
          }
        : null,
    clinic:
      data.clinic && clinicProfileData
        ? {
            id: data.clinic.id,
            legalName: clinicProfileData.legalName,
            actualAddress: clinicProfileData.actualAddress,
            phone: data.clinic.phone,
          }
        : null,
  }

  return appointment
}

/**
 * Обновление записи
 */
export const updateAppointment = async (
  appointmentId: string,
  data: AppointmentUpdateData,
): Promise<Appointment> => {
  logger.info("Обновление записи", {
    appointmentId,
    updates: Object.keys(data),
  })

  // Получаем старую запись для проверки изменения статуса
  const oldAppointment = await getAppointmentById(appointmentId)
  const oldStatus = oldAppointment?.status

  const updateData: Partial<Appointment> = {
    updatedAt: new Date().toISOString(),
  }

  if (data.status !== undefined) {
    updateData.status = data.status
    if (data.status === "cancelled") {
      updateData.cancelledAt = new Date().toISOString()
    } else if (data.status === "completed") {
      updateData.completedAt = new Date().toISOString()
    }
  }

  if (data.dateTime !== undefined) {
    updateData.dateTime =
      data.dateTime instanceof Date ? data.dateTime.toISOString() : data.dateTime
  }

  if (data.duration !== undefined) {
    updateData.duration = data.duration
  }

  if (data.reason !== undefined) {
    updateData.reason = data.reason
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes
  }

  const { data: appointment, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .update(updateData)
    .eq("id", appointmentId)
    .select()
    .single()

  if (error) {
    logger.error("Ошибка обновления записи", new Error(error.message), {
      appointmentId,
    })
    throw error
  }

  if (!appointment) {
    throw new Error("Запись не найдена после обновления")
  }

  logger.info("Запись успешно обновлена", {
    appointmentId,
  })

  // Создаём уведомления при изменении статуса
  if (data.status !== undefined && oldStatus && oldStatus !== data.status) {
    try {
      const appointmentWithDetails = await getAppointmentById(appointmentId)
      if (!appointmentWithDetails || !appointmentWithDetails.patient) {
        return appointment
      }

      const patientId = appointmentWithDetails.patient.id
      const doctorName = appointmentWithDetails.doctor?.fullName || null
      const clinicName = appointmentWithDetails.clinic?.legalName || null

      if (data.status === "confirmed") {
        await createAppointmentConfirmedNotification(
          patientId,
          appointmentId,
          appointment.dateTime,
          doctorName,
          clinicName,
        ).catch((error) => {
          logger.error("Ошибка создания уведомления о подтверждении", error as Error, {
            appointmentId,
          })
        })
      } else if (data.status === "cancelled") {
        await createAppointmentCancelledNotification(
          patientId,
          appointmentId,
          appointment.dateTime,
          doctorName,
          clinicName,
        ).catch((error) => {
          logger.error("Ошибка создания уведомления об отмене", error as Error, {
            appointmentId,
          })
        })
      } else if (data.status === "completed") {
        await createAppointmentCompletedNotification(
          patientId,
          appointmentId,
          appointment.dateTime,
        ).catch((error) => {
          logger.error("Ошибка создания уведомления о завершении", error as Error, {
            appointmentId,
          })
        })
      }
    } catch (error) {
      logger.error("Ошибка при создании уведомлений об обновлении записи", error as Error, {
        appointmentId,
      })
    }
  }

  return appointment
}

/**
 * Отмена записи
 */
export const cancelAppointment = async (appointmentId: string): Promise<Appointment> => {
  return updateAppointment(appointmentId, {
    status: "cancelled",
  })
}

/**
 * Получение доступных временных слотов для врача или клиники
 */
export const getAvailableTimeSlots = async (
  doctorId: string | null,
  clinicId: string | null,
  date: string, // ISO дата (YYYY-MM-DD)
): Promise<TimeSlot[]> => {
  if (!doctorId && !clinicId) {
    throw new Error("Необходимо указать либо врача, либо клинику")
  }

  // Получаем расписание врача
  let schedule: DoctorSchedule | null = null
  if (doctorId) {
    schedule = await getDoctorSchedule(doctorId)
  }

  // Если врач работает в клинике, используем его расписание
  // Иначе используем расписание клиники
  if (!schedule && clinicId) {
    // TODO: Реализовать получение расписания клиники
    schedule = {
      doctorId: clinicId,
      schedule: [
        { dayOfWeek: 1, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
        { dayOfWeek: 2, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
        { dayOfWeek: 3, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
        { dayOfWeek: 4, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
        { dayOfWeek: 5, timeRanges: [{ startTime: "09:00", endTime: "18:00" }], isAvailable: true },
      ],
      defaultDuration: DEFAULT_TIME_SLOT_DURATION,
      minHoursBeforeAppointment: MIN_HOURS_BEFORE_APPOINTMENT,
    }
  }

  if (!schedule) {
    return []
  }

  // Получаем день недели для указанной даты
  const appointmentDate = new Date(date)
  const dayOfWeek = appointmentDate.getDay()

  // Находим расписание на этот день
  const daySchedule = schedule.schedule.find((d) => d.dayOfWeek === dayOfWeek)

  if (!daySchedule || !daySchedule.isAvailable) {
    return []
  }

  // Получаем существующие записи на эту дату
  const dateStart = new Date(date)
  dateStart.setHours(0, 0, 0, 0)
  const dateEnd = new Date(date)
  dateEnd.setHours(23, 59, 59, 999)

  const { data: existingAppointments } = await supabase
    .from(APPOINTMENTS_TABLE)
    .select("id, dateTime, duration")
    .eq(doctorId ? "doctorId" : "clinicId", doctorId || clinicId)
    .gte("dateTime", dateStart.toISOString())
    .lte("dateTime", dateEnd.toISOString())
    .in("status", ["pending", "confirmed"])

  const slots: TimeSlot[] = []
  const slotDuration = schedule.defaultDuration
  const now = new Date()

  // Обрабатываем каждый временной диапазон
  for (const timeRange of daySchedule.timeRanges) {
    const [startHour, startMinute] = timeRange.startTime.split(":").map(Number)
    const [endHour, endMinute] = timeRange.endTime.split(":").map(Number)

    const startTime = new Date(appointmentDate)
    startTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date(appointmentDate)
    endTime.setHours(endHour, endMinute, 0, 0)

    let currentSlot = new Date(startTime)

    while (currentSlot < endTime) {
      const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60 * 1000)

      // Проверяем, не выходит ли слот за границы диапазона
      if (slotEnd > endTime) {
        break
      }

      // Проверяем, не занят ли слот
      const isOccupied = existingAppointments?.some((apt) => {
        const aptStart = new Date(apt.dateTime)
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60 * 1000)
        return (
          (aptStart < slotEnd && aptEnd > currentSlot) ||
          (currentSlot >= aptStart && currentSlot < aptEnd)
        )
      })

      // Проверяем, что слот в будущем (с учётом минимального времени до записи)
      const minTime = new Date(now.getTime() + MIN_HOURS_BEFORE_APPOINTMENT * 60 * 60 * 1000)
      const isAvailable = !isOccupied && currentSlot >= minTime

      slots.push({
        startTime: currentSlot.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable,
        appointmentId: isOccupied
          ? existingAppointments?.find((apt) => {
              const aptStart = new Date(apt.dateTime)
              const aptEnd = new Date(aptStart.getTime() + apt.duration * 60 * 1000)
              return aptStart < slotEnd && aptEnd > currentSlot
            })?.id || null
          : null,
      })

      currentSlot = new Date(currentSlot.getTime() + slotDuration * 60 * 1000)
    }
  }

  return slots
}

/**
 * Получение расписания врача
 */
export const getDoctorSchedule = async (doctorId: string): Promise<DoctorSchedule | null> => {
  const { data, error } = await supabase
    .from(DOCTOR_SCHEDULES_TABLE)
    .select("*")
    .eq("doctorId", doctorId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      await supabase
        .from(DOCTOR_SCHEDULES_TABLE)
        .upsert(
          {
            doctorId,
            schedule: DEFAULT_DOCTOR_SCHEDULE,
            defaultDuration: DEFAULT_TIME_SLOT_DURATION,
            minHoursBeforeAppointment: MIN_HOURS_BEFORE_APPOINTMENT,
          },
          {
            onConflict: "doctorId",
          },
        )
        .select()
        .single()
    }
    logger.error("Ошибка получения расписания врача", new Error(error.message), {
      doctorId,
    })
    throw error
  }

  const scheduleData = (data.schedule as DoctorScheduleDay[]) || DEFAULT_DOCTOR_SCHEDULE

  return {
    doctorId: data.doctorId,
    schedule: scheduleData.length > 0 ? scheduleData : DEFAULT_DOCTOR_SCHEDULE,
    defaultDuration: data.defaultDuration || DEFAULT_TIME_SLOT_DURATION,
    minHoursBeforeAppointment: data.minHoursBeforeAppointment || MIN_HOURS_BEFORE_APPOINTMENT,
  }
}

/**
 * Обновление расписания врача
 */
export const updateDoctorSchedule = async (
  doctorId: string,
  schedule: DoctorSchedule,
): Promise<DoctorSchedule> => {
  logger.info("Обновление расписания врача", {
    doctorId,
  })

  // Проверка на дубликаты dayOfWeek
  const dayOfWeekValues = schedule.schedule.map((day) => day.dayOfWeek)
  const uniqueDayOfWeeks = new Set(dayOfWeekValues)
  if (dayOfWeekValues.length !== uniqueDayOfWeeks.size) {
    const duplicates = dayOfWeekValues.filter(
      (day, index) => dayOfWeekValues.indexOf(day) !== index,
    )
    const errorMessage = "Ошибка: Не повторяйте недели"
    logger.error("Ошибка валидации расписания", new Error(errorMessage), {
      doctorId,
      duplicates,
    })
    throw new Error(errorMessage)
  }

  const { data, error } = await supabase
    .from(DOCTOR_SCHEDULES_TABLE)
    .upsert(
      {
        doctorId,
        schedule: schedule.schedule,
        defaultDuration: schedule.defaultDuration,
        minHoursBeforeAppointment: schedule.minHoursBeforeAppointment,
        updatedAt: new Date().toISOString(),
      },
      {
        onConflict: "doctorId",
      },
    )
    .select()
    .single()

  if (error) {
    logger.error("Ошибка обновления расписания врача", new Error(error.message), {
      doctorId,
    })
    throw error
  }

  if (!data) {
    throw new Error("Не удалось обновить расписание")
  }

  logger.info("Расписание врача успешно обновлено", {
    doctorId,
  })

  return {
    doctorId: data.doctorId,
    schedule: data.schedule as DoctorScheduleDay[],
    defaultDuration: data.defaultDuration,
    minHoursBeforeAppointment: data.minHoursBeforeAppointment,
  }
}
