import { api } from "@/shared/api/axiosInstance"
import type { Schedule } from "../types/schedule.types"

export const getSchedules = async (targetId: string, date?: string): Promise<Schedule[]> => {
  const { data } = await api.get(`schedules/${targetId}`, { params: { date } })
  return data
}

export const updateSchedule = async (id: string, isAvailable: boolean): Promise<void> => {
  return await api.post(`schedules/${id}`, { isAvailable })
}
