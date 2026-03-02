/**
 * @fileoverview Компонент фильтрации записей по статусу
 *
 * Адаптивный компонент, который отображает:
 * - На мобильных устройствах: Select dropdown
 * - На десктопе: кнопки для быстрого переключения
 *
 * @module features/appointments/ui/AppointmentStatusFilter
 */

import { Button } from "@/shared/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LOCALES } from "@/entities/appointment/model/appointment.constants"

type FilterStatus = keyof typeof APPOINTMENT_STATUS

interface AppointmentStatusFilterProps {
  selectedStatus: FilterStatus
  onStatusChange: (status: FilterStatus) => void
  className?: string
}

export const AppointmentStatusFilter = ({
  selectedStatus,
  onStatusChange,
  className,
}: AppointmentStatusFilterProps) => {
  const isMobile = useIsMobile()

  const statuses = Object.keys(APPOINTMENT_STATUS) as FilterStatus[]

  if (isMobile) {
    return (
      <Select
        value={selectedStatus}
        onValueChange={(value) => onStatusChange(value as FilterStatus)}
      >
        <SelectTrigger className={`w-full ${className || ""}`}>
          <SelectValue placeholder="Выберите статус" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {APPOINTMENT_STATUS_LOCALES[status].ru}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div
      className={`grid gap-2 md:grid-cols-3 ${className || ""}`}>
      {statuses.map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStatusChange(status)}
        >
          {APPOINTMENT_STATUS_LOCALES[status].ru}
        </Button>
      ))}
    </div>
  )
}
