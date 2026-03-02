/**
 * @fileoverview Календарь для выбора даты записи
 *
 * @module features/appointments/ui/AppointmentCalendar
 */

import { Calendar } from "@/shared/ui/calendar"
import { ru } from "date-fns/locale"
import { TimeSlotPicker } from "./TimeSlotPicker"
import { Separator } from "@/shared/ui/separator"
import { Calendar1 } from "lucide-react"
import { useIsMobile } from "@/shared/hooks/useMobile"
import type { TimeSlot } from "@/entities/schedule/types/schedule.types"
import { useMemo } from "react"
import { useSchedules } from "@/entities/schedule/api/schedule.queries"

interface AppointmentCalendarProps {
  slots: TimeSlot[]
  targetId: string
  isLoading: boolean
  selectedDate: Date
  onSelectDate: (date: Date) => void
  selectedTime: string | null
  onSelectTime: (timeSlotId: string) => void
}

export const AppointmentCalendarWithTime = ({
  slots,
  targetId,
  isLoading,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}: AppointmentCalendarProps) => {
  // Минимальная дата - сегодня + минимальное время до записи
  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 2) // MIN_HOURS_BEFORE_APPOINTMENT
  const isMobile = useIsMobile()

  const { data: schedules = [], isLoading: isSchedulesLoading } = useSchedules(targetId, true)

  // Максимальная дата - через 3 месяца
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)

  const activeDays = useMemo(() =>
    schedules.map((s) => s.dayOfWeek),
    [schedules])

  return (
    <div className="flex flex-col rounded-xl border md:flex-row">
      <div className="flex-1 place-items-center">
        <Calendar
          required
          mode="single"
          selected={selectedDate || undefined}
          onSelect={onSelectDate}
          disabled={(date) => {
            const dayOfWeek = date.getDay()
            const isWorkingDay = activeDays.includes(dayOfWeek)

            return (
              date < minDate ||
              date > maxDate ||
              !isWorkingDay ||
              isSchedulesLoading
            )
          }}
          locale={ru}
          className="[--cell-size:--spacing(10.5)] md:[--cell-size:--spacing(12)]"
        />
      </div>
      <Separator orientation={isMobile ? "horizontal" : "vertical"} />

      {selectedDate ? (
        <div className="flex-1">
          <TimeSlotPicker
            slots={slots}
            isLoading={isLoading}
            onSelect={onSelectTime}
            selectedTime={selectedTime}
          />
        </div>
      ) : (
        <div className="h-full place-content-center p-4 text-center">
          <Calendar1 className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Сначала выберите дату, потом сможете выбрать время
          </p>
        </div>
      )}
    </div>
  )
}
