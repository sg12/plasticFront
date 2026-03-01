import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
} from "./appointment.api"
import type { APPOINTMENT_STATUS } from "../types/appointment.types"
import { toast } from "sonner"

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  detail: (id: string) => [...appointmentKeys.all, "detail", id] as const,
}

export const useAppointments = () => {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: getAppointments,
  })
}

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointment(id),
    enabled: !!id,
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast.success("Запись успешно создана!", { id: "appointment-loading" })
    },
    onError: () => {
      toast.error("Ошибка при создании записи", { id: "appointment-loading" })
    },
  })
}

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: APPOINTMENT_STATUS }) =>
      updateAppointment(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.id) })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка при обновлении статуса")
    },
  })
}
