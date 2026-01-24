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

  const handleComplete = async (appointmentId: string) => {
    if (confirm("Завершить запись? После завершения запись будет перемещена в историю.")) {
      await updateExistingAppointment(appointmentId, { status: "completed" })
    }
  }

  return {
    handleComplete,
  }
}
