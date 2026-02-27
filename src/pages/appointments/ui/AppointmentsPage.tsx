/**
 * @fileoverview Страница управления записями на приём
 *
 * Обёртка для разных ролей пользователей
 *
 * @module pages/appointments/ui/Appointments
 */

import { AppointmentsForm } from "@/widgets/appointments/AppointmentForm"


export const AppointmentsPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Записи на приём</h3>
          <p className="text-muted-foreground mt-2">Управляйте записями на приём</p>
        </div>
      </div>
      <AppointmentsForm />
    </div>
  )
}

