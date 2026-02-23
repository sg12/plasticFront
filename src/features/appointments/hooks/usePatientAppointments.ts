/**
 * @fileoverview Хук для управления записями пациента
 *
 * Инкапсулирует логику отмены записей пациентом
 *
 * @module features/appointments/hooks/usePatientAppointments
 */

import { useAppointmentsStore } from "@/entities/appointment/model/store"

export const usePatientAppointments = () => {
  const { cancelExistingAppointment } = useAppointmentsStore()

  const handleCancel = async (appointmentId: string) => {
    if (confirm("Вы уверены, что хотите отменить запись?")) {
      await cancelExistingAppointment(appointmentId)
    }
  }

  return {
    handleCancel,
  }
}
