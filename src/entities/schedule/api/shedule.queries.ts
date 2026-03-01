import { useQuery } from "@tanstack/react-query"
import { getSchedules } from "./schedule.api"
import type { TimeSlot } from "../types/schedule.types"

export const scheduleKeys = {
  all: ["schedules"] as const,
  slots: (targetId: string, date: string) =>
    [...scheduleKeys.all, "slots", targetId, date] as const,
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
