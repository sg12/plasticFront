/**
 * @fileoverview Страница управления клиниками врача
 */

import { DoctorClinicsList } from "@/widgets/doctor/doctorClinicsList/ui/DoctorClinicsList"

export const DoctorClinics = () => {
  return (
    <div className="space-global">
      <div>
        <h3 className="text-3xl font-semibold">Клиники</h3>
        <p className="text-muted-foreground mt-2">Управляйте приглашениями от клиник</p>
      </div>
      <DoctorClinicsList />
    </div>
  )
}
