import { api } from "@/shared/api/axiosInstance"
import type { Appointment, APPOINTMENT_STATUS } from "../types/appointment.types"
import type { CreateAppointmentDto } from "../model/appointment.schema"

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("/appointments")
  return data
}

export const getAppointment = async (id: string): Promise<Appointment> => {
  const { data } = await api.get(`/appointments/${id}`)
  return data
}

export const createAppointment = async (
  createAppointmentDto: CreateAppointmentDto,
): Promise<Appointment> => {
  const { data } = await api.post("appointments", createAppointmentDto)
  return data
}

export const updateAppointment = async (
  id: string,
  status: APPOINTMENT_STATUS,
): Promise<Appointment> => {
  const { data } = await api.post(`appointments/${id}`, {}, { params: { status } })
  return data
}
