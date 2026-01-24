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
import { APPOINTMENT_STATUS_LABELS } from "@/entities/appointments/model/constants"
import type { AppointmentStatus } from "@/entities/appointments/types/types"
import { useIsMobile } from "@/shared/hooks/useMobile"
import type { UserRole } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"

interface AppointmentStatusFilterProps {
    /** Выбранный статус */
    selectedStatus: AppointmentStatus | "all"
    /** Обработчик изменения статуса */
    onStatusChange: (status: AppointmentStatus | "all") => void
    /** Роль пользователя (для кастомизации отображения) */
    userRole?: UserRole
    /** Дополнительные классы для контейнера */
    className?: string
}

export const AppointmentStatusFilter = ({
    selectedStatus,
    onStatusChange,
    userRole,
    className,
}: AppointmentStatusFilterProps) => {
    const isMobile = useIsMobile()

    const statuses = ["all", "pending", "confirmed", "cancelled", "completed"] as const

    if (isMobile) {
        return (
            <Select
                value={selectedStatus}
                onValueChange={(value) => onStatusChange(value as AppointmentStatus | "all")}
            >
                <SelectTrigger className={`w-full ${className || ""}`}>
                    <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status === "all" ? "Все" : APPOINTMENT_STATUS_LABELS[status]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }

    return (
        <div
            className={`flex gap-2 ${userRole === USER_ROLES.DOCTOR ? "grid md:grid-cols-2 lg:grid-cols-5 w-full" : ""
                } ${className || ""}`}
        >
            {statuses.map((status) => (
                <Button
                    key={status}
                    variant={selectedStatus === status ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => onStatusChange(status)}
                >
                    {status === "all" ? "Все" : APPOINTMENT_STATUS_LABELS[status]}
                </Button>
            ))}
        </div>
    )
}
