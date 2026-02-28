/**
 * @fileoverview Кнопка для открытия формы записи
 *
 * @module features/appointments/ui/AppointmentButton
 */

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { AppointmentModal } from "@/widgets/appointments/AppointmentModal"

interface AppointmentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    doctorId?: string | null
    clinicId?: string | null
}

export const AppointmentButton = ({ doctorId, clinicId, className }: AppointmentButtonProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false)

    return (
        <>
            <Button
                className={className}
                variant="primary"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsFormOpen(true)
                }}
            >
                Записаться
            </Button>
            <AppointmentModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                doctorId={doctorId}
                clinicId={clinicId}
            />
        </>
    )
}
