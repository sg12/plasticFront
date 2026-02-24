import { api } from "@/shared/api/axiosInstance"
import type { Schedule } from "../types/schedule.types"

export const getSchedules = async (id: string, date: string): Promise<Schedule[]> => {
  const { data } = await api.get(`schedules/${id}`, { params: { date } })
  return data
}
