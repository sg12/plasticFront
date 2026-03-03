/**
 * @fileoverview Кнопка для открытия формы записи
 *
 * @module features/appointments/ui/AppointmentButton
 */

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { AppointmentModal } from "@/widgets/appointments/AppointmentModal"
import type { User } from "@/entities/user/types/user.types"

interface AppointmentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    target: User
}

export const AppointmentButton = ({ target, className }: AppointmentButtonProps) => {
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
                target={target}
            />
        </>
    )
}
