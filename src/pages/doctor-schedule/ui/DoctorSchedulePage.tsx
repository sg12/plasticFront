/**
 * @fileoverview Страница управления расписанием врача
 *
 * @module pages/doctorSchedule/ui/DoctorSchedule
 */

import { DoctorScheduleForm } from "@/features/user-management/doctor/schedule/ui/DoctorScheduleForm"

export const DoctorSchedulePage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Расписание приёма</h3>
          <p className="text-muted-foreground mt-2">Настройте расписание работы и доступные временные слоты для записи пациентов</p>
        </div>
      </div>
      <DoctorScheduleForm />
    </div>
  )
}
