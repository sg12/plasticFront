/**
 * @fileoverview Хук для управления записями клиники
 *
 * Инкапсулирует логику завершения записей клиникой
 *
 * @module features/appointments/hooks/useClinicAppointments
 */

import { useAppointmentsStore } from "@/entities/appointments/model/store"

export const useClinicAppointments = () => {
  const { updateExistingAppointment } = useAppointmentsStore()

  const handleConfirm = async (appointmentId: string) => {
    await updateExistingAppointment(appointmentId, { status: "confirmed" })
  }

  const handleCancel = async (appointmentId: string) => {
    if (confirm("Вы уверены, что хотите отменить запись?")) {
      await updateExistingAppointment(appointmentId, { status: "cancelled" })
    }
  }

  const handleComplete = async (appointmentId: string) => {
    if (confirm("Завершить запись? После завершения запись будет перемещена в историю.")) {
      await updateExistingAppointment(appointmentId, { status: "completed" })
    }
  }

  return {
    handleCancel,
    handleConfirm,
    handleComplete,
  }
}
