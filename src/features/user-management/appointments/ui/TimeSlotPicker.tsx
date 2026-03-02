/**
 * @fileoverview Компонент выбора временного слота
 *
 * @module features/appointments/ui/TimeSlotPicker
 */

import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Clock, Check } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"
import { useIsMobile } from "@/shared/hooks/useMobile"
import type { TimeSlot } from "@/entities/schedule/types/schedule.types"
import { SLOT_STATUS } from "@/entities/schedule/model/schedule.constants"

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  isLoading: boolean
  onSelect: (timeSlotId: string) => void
  selectedTime?: string | null
}

export const TimeSlotPicker = ({
  slots,
  isLoading,
  onSelect,
  selectedTime,
}: TimeSlotPickerProps) => {
  const isMobile = useIsMobile()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: isMobile ? 2 : 6 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full" />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="h-full place-content-center p-4 text-center">
        <Clock className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          Нет доступных временных слотов на выбранную дату
        </p>
      </div>
    )
  }

  return (
    <div className="no-scrollbar flex max-h-[445px] flex-col gap-2 overflow-y-auto p-3">
      {slots.map((slot) => {
        const startTime = formatInTimeZone(new Date(slot.startAt), 'UTC', "HH:mm")
        const slotKey = `${slot.startAt}-${slot.endAt}`

        const isSelected = selectedTime === slot.id
        const isAvailable = slot.status === SLOT_STATUS.AVAILABLE

        return (
          <Button
            key={slotKey}
            type="button"
            variant={isSelected ? "primary" : isAvailable ? "secondary" : "ghost"}
            disabled={!isAvailable}
            onClick={() => onSelect(slot.id)}
            size={isMobile ? "lg" : "md"}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{startTime}</span>
              </div>
              {isSelected ? (
                <Check className="h-4 w-4" />
              ) : (
                !isAvailable && <span className="text-[10px] uppercase opacity-60">Занято</span>
              )}
            </div>
          </Button>
        )
      })}
    </div>
  )
}
