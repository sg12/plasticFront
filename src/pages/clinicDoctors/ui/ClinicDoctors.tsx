/**
 * @fileoverview Страница управления врачами клиники
 */

import { ClinicDoctorsList } from "@/widgets/clinic/clinicDoctorsList/ui/ClinicDoctorsList"

export const ClinicDoctors = () => {
  return (
    <div className="space-global">
      <div>
        <h3 className="text-3xl font-semibold">Врачи клиники</h3>
        <p className="text-muted-foreground mt-2">
          Управляйте списком врачей вашей клиники
        </p>
      </div>
      <ClinicDoctorsList />
    </div>
  )
}
