/**
 * @fileoverview Страница управления врачами клиники
 */

import { ClinicDoctorsList } from "@/widgets/clinic/ClinicDoctorsList"

export const ClinicDoctorsPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Врачи клиники</h3>
          <p className="text-muted-foreground mt-2">Управляйте списком врачей вашей клиники</p>
        </div>
      </div>
      <ClinicDoctorsList />
    </div>
  )
}
