/**
 * @fileoverview Кнопка для открытия формы записи
 *
 * @module features/appointments/ui/AppointmentButton
 */

import { Button } from "@/shared/ui/button"
import { CalendarDays } from "lucide-react"
import { Link } from "react-router"
import { ROUTES } from "@/shared/model/routes"

export const DoctorScheduleButton = () => {
  return (
    <Link to={ROUTES.DOCTOR_SCHEDULE} className="max-md:w-full">
      <Button variant="secondary" className="max-md:w-full">
        <CalendarDays className="mr-2 h-4 w-4" />
        Настроить расписание
      </Button>
    </Link>
  )
}
