/**
 * @fileoverview Кнопка для открытия формы записи
 *
 */

import { Button } from "@/shared/ui/button"
import { CalendarDays } from "lucide-react"
import { Link } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { useMe } from "@/entities/user/api/user.queries"
import { USER_ROLE } from "@/entities/user/model/user.constants"

export const DoctorScheduleButton = () => {
  const { data: user } = useMe()

  if (user?.role !== USER_ROLE.DOCTOR) {
    return
  }

  return (
    <Link to={ROUTES.DOCTOR_SCHEDULE} className="max-md:w-full">
      <Button variant="secondary" className="max-md:w-full">
        <CalendarDays className="mr-2 h-4 w-4" />
        Настроить расписание
      </Button>
    </Link>
  )
}
