/**
 * @fileoverview Страница управления клиниками врача
 */

import { DoctorClinicsList } from "@/widgets/doctor/DoctorClinicsList"

export const DoctorClinicsPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Клиники</h3>
          <p className="text-muted-foreground mt-2">Управляйте приглашениями от клиник</p>
        </div>
      </div>
      <DoctorClinicsList />
    </div>
  )
}
