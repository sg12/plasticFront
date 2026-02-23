/**
 * @fileoverview Хук для управления записями врача
 *
 * Инкапсулирует логику подтверждения, отмены и завершения записей врачом
 *
 * @module features/appointments/hooks/useDoctorAppointments
 */

import { useAppointmentsStore } from "@/entities/appointment/model/store"

export const useDoctorAppointments = () => {
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
    handleConfirm,
    handleCancel,
    handleComplete,
  }
}
