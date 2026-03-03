import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getSchedules, updateSchedule } from "./schedule.api"
import type { TimeSlot } from "../types/schedule.types"
import { toast } from "sonner"
import type { UpdateScheduleDto } from "../model/schedule.schema"

export const scheduleKeys = {
  all: ["schedules"] as const,
  list: (targetId: string) => [...scheduleKeys.all, "list", targetId] as const,
  slots: (targetId: string, date: string) =>
    [...scheduleKeys.all, "slots", targetId, date] as const,
}

export const useSchedules = (targetId: string, isOpen: boolean) => {
  return useQuery({
    queryKey: scheduleKeys.list(targetId),
    queryFn: () => getSchedules(targetId),
    enabled: !!targetId && isOpen,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useTimeSlots = (targetId: string, date: string, isOpen: boolean) => {
  return useQuery({
    queryKey: scheduleKeys.slots(targetId, date),
    queryFn: async () => {
      const data = await getSchedules(targetId!, date!)
      return data as unknown as TimeSlot[]
    },
    enabled: !!targetId && !!date && isOpen,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useUpdateSchedule = (targetId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updateScheduleDto }: { id: string; updateScheduleDto: UpdateScheduleDto }) =>
      updateSchedule(id, updateScheduleDto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.list(targetId),
      })
      toast.success("График успешно обновлен")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.list(targetId),
      })
      toast.error(error?.response?.data?.message || "Не удалось обновить график")
    },
  })
}
