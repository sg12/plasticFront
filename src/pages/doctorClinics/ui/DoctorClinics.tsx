/**
 * @fileoverview Страница управления клиниками врача
 */

import { DoctorClinicsList } from "@/widgets/doctorClinicsList/ui/DoctorClinicsList"
import { useAuthStore } from "@/entities/auth/model/store"

export const DoctorClinics = () => {
  const { profile } = useAuthStore()
  const doctorId = profile?.id

  return (
    <div className="space-global">
      <div>
        <h2>Клиники</h2>
        <p className="mt-2 text-gray-600">Управляйте приглашениями от клиник</p>
      </div>
      <DoctorClinicsList doctorId={doctorId} />
    </div>
  )
}
