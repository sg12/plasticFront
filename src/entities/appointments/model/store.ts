/**
 * @fileoverview Store для работы с записями на приём
 *
 * @module entities/appointments/model/store
 */

import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type {
  Appointment,
  AppointmentWithDetails,
  AppointmentCreateData,
  AppointmentUpdateData,
  AppointmentFilters,
  PaginationParams,
  TimeSlot,
  DoctorSchedule,
} from "../types/types"
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
  getDoctorSchedule,
  updateDoctorSchedule,
} from "../api/api"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/model/store"
import { logger } from "@/shared/lib/logger"
import { useUserStore } from "@/entities/user/model/store"

interface AppointmentsState {
  appointments: Appointment[]
  currentAppointment: AppointmentWithDetails | null
  availableTimeSlots: TimeSlot[]
  doctorSchedule: DoctorSchedule | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  isLoading: boolean
  isLoadingSlots: boolean
  isLoadingSchedule: boolean
  error: string | null

  // Методы для работы с записями
  loadAppointments: (filters?: AppointmentFilters, pagination?: PaginationParams) => Promise<void>
  loadAppointmentById: (appointmentId: string) => Promise<void>
  createNewAppointment: (data: AppointmentCreateData) => Promise<Appointment | null>
  updateExistingAppointment: (appointmentId: string, data: AppointmentUpdateData) => Promise<void>
  cancelExistingAppointment: (appointmentId: string) => Promise<void>
  refreshAppointments: (
    filters?: AppointmentFilters,
    pagination?: PaginationParams,
  ) => Promise<void>

  // Методы для работы с временными слотами
  loadAvailableTimeSlots: (
    doctorId: string | null,
    clinicId: string | null,
    date: string,
  ) => Promise<void>

  // Методы для работы с расписанием врача
  loadDoctorSchedule: (doctorId: string) => Promise<void>
  updateSchedule: (doctorId: string, schedule: DoctorSchedule) => Promise<void>

  // Утилиты
  clearError: () => void
  clearCurrentAppointment: () => void
  clearTimeSlots: () => void
}

export const useAppointmentsStore = create<AppointmentsState>()(
  immer<AppointmentsState>((set, get) => ({
    appointments: [] as Appointment[],
    currentAppointment: null,
    availableTimeSlots: [] as TimeSlot[],
    doctorSchedule: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    isLoading: false,
    isLoadingSlots: false,
    isLoadingSchedule: false,
    error: null,

    loadAppointments: async (filters = {}, pagination = {}) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const result = await getAppointments(filters, pagination)
        set((state) => {
          state.appointments = result.appointments
          state.pagination = {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          }
          state.isLoading = false
          state.error = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки записей"
        set((state) => {
          state.error = errorMessage
          state.isLoading = false
        })
        logger.error("Ошибка загрузки записей в store", error as Error, {
          filters,
          pagination,
        })
      }
    },

    loadAppointmentById: async (appointmentId: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const appointment = await getAppointmentById(appointmentId)
        set((state) => {
          state.currentAppointment = appointment
          state.isLoading = false
          state.error = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки записи"
        set((state) => {
          state.error = errorMessage
          state.isLoading = false
        })
        logger.error("Ошибка загрузки записи в store", error as Error, {
          appointmentId,
        })
      }
    },

    createNewAppointment: async (data: AppointmentCreateData) => {
      const { user } = useAuthStore.getState()
      const { profile } = useUserStore.getState()

      if (!user?.id) {
        toast.error("Вы не авторизованы")
        return null
      }

      try {
        set({ isLoading: true })

        const newAppointment = await createAppointment(user.id, {
          ...data,
          contactPhone: profile?.phone,
        })

        set((state) => {
          state.appointments.unshift(newAppointment)
          state.pagination.total += 1
        })

        toast.success("Запись успешно создана")
        set({ isLoading: false })
        return newAppointment
      } catch (error) {
        set({ isLoading: false })
        const errorMessage = error instanceof Error ? error.message : "Ошибка при создании записи"
        toast.error(errorMessage)
        logger.error("Ошибка создания записи в store", error as Error, {
          userId: user?.id,
        })
        throw error
      }
    },

    updateExistingAppointment: async (appointmentId: string, data: AppointmentUpdateData) => {
      try {
        const updatedAppointment = await updateAppointment(appointmentId, data)

        set((state) => {
          const index = state.appointments.findIndex((apt) => apt.id === appointmentId)
          if (index !== -1) {
            state.appointments[index] = updatedAppointment
          }
          if (state.currentAppointment?.id === appointmentId) {
            state.currentAppointment = {
              ...state.currentAppointment,
              ...updatedAppointment,
            }
          }
        })

        toast.success("Запись успешно обновлена")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при обновлении записи"
        toast.error(errorMessage)
        logger.error("Ошибка обновления записи в store", error as Error, {
          appointmentId,
        })
        throw error
      }
    },

    cancelExistingAppointment: async (appointmentId: string) => {
      try {
        const cancelledAppointment = await cancelAppointment(appointmentId)

        set((state) => {
          const index = state.appointments.findIndex((apt) => apt.id === appointmentId)
          if (index !== -1) {
            state.appointments[index] = cancelledAppointment
          }
          if (state.currentAppointment?.id === appointmentId) {
            state.currentAppointment = {
              ...state.currentAppointment,
              ...cancelledAppointment,
            }
          }
        })

        toast.success("Запись успешно отменена")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при отмене записи"
        toast.error(errorMessage)
        logger.error("Ошибка отмены записи в store", error as Error, {
          appointmentId,
        })
        throw error
      }
    },

    refreshAppointments: async (filters = {}, pagination = {}) => {
      await get().loadAppointments(filters, pagination)
    },

    loadAvailableTimeSlots: async (
      doctorId: string | null,
      clinicId: string | null,
      date: string,
    ) => {
      set((state) => {
        state.isLoadingSlots = true
        state.error = null
      })

      try {
        const slots = await getAvailableTimeSlots(doctorId, clinicId, date)

        set((state) => {
          state.availableTimeSlots = slots
          state.isLoadingSlots = false
          state.error = null
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка загрузки временных слотов"
        set((state) => {
          state.error = errorMessage
          state.isLoadingSlots = false
        })
        logger.error("Ошибка загрузки временных слотов в store", error as Error, {
          doctorId,
          clinicId,
          date,
        })
      }
    },

    loadDoctorSchedule: async (doctorId: string) => {
      set((state) => {
        state.isLoadingSchedule = true
        state.error = null
      })

      try {
        const schedule = await getDoctorSchedule(doctorId)
        set((state) => {
          state.doctorSchedule = schedule
          state.isLoadingSchedule = false
          state.error = null
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки расписания"
        set((state) => {
          state.error = errorMessage
          state.isLoadingSchedule = false
        })
        logger.error("Ошибка загрузки расписания в store", error as Error, {
          doctorId,
        })
      }
    },

    updateSchedule: async (doctorId: string, schedule: DoctorSchedule) => {
      set((state) => {
        state.isLoadingSchedule = true
        state.error = null
      })

      try {
        const updatedSchedule = await updateDoctorSchedule(doctorId, schedule)
        set((state) => {
          state.doctorSchedule = updatedSchedule
          state.isLoadingSchedule = false
          state.error = null
        })
        toast.success("Расписание успешно обновлено")
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка при обновлении расписания"
        set((state) => {
          state.error = errorMessage
          state.isLoadingSchedule = false
        })
        toast.error(errorMessage)
        logger.error("Ошибка обновления расписания в store", error as Error, {
          doctorId,
        })
        throw error
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    clearCurrentAppointment: () => {
      set((state) => {
        state.currentAppointment = null
      })
    },

    clearTimeSlots: () => {
      set((state) => {
        state.availableTimeSlots = []
      })
    },
  })),
)
