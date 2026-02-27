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

interface AppointmentCalendarProps {
  selectedDate?: Date | null
  onSelectDate: (date: Date | undefined) => void
  selectedTime?: string | null
  onSelectTime: (time: string) => void
  doctorId?: string | null
  clinicId?: string | null
}

export const AppointmentCalendarWithTime = ({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}: AppointmentCalendarProps) => {
  // Минимальная дата - сегодня + минимальное время до записи
  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 2) // MIN_HOURS_BEFORE_APPOINTMENT
  const { availableTimeSlots, isLoadingSlots } = useAppointmentsStore()
  const isMobile = useIsMobile()

  // Максимальная дата - через 3 месяца
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)

  return (
    <div className="flex flex-col rounded-xl border md:flex-row">
      <div className="flex-1 place-items-center">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={onSelectDate}
          disabled={(date) => {
            return date < minDate || date > maxDate
          }}
          locale={ru}
          className="[--cell-size:--spacing(10.5)] md:[--cell-size:--spacing(12)]"
        />
      </div>
      <Separator orientation={isMobile ? "horizontal" : "vertical"} />

      {selectedDate ? (
        <div className="flex-1">
          <TimeSlotPicker
            slots={availableTimeSlots}
            isLoading={isLoadingSlots}
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
