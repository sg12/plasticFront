/**
 * @fileoverview Страница управления врачами клиники
 */

import { ClinicDoctorsList } from "@/widgets/clinic/clinicDoctorsList/ui/ClinicDoctorsList"
import { useUserStore } from "@/entities/user/model/store"

export const ClinicDoctors = () => {
  const { profile } = useUserStore()
  const clinicId = profile?.id

  return (
    <div className="space-global">
      <div>
        <h2>Врачи клиники</h2>
        <p className="mt-2 text-gray-600">Управляйте списком врачей вашей клиники</p>
      </div>
      <ClinicDoctorsList clinicId={clinicId} />
    </div>
  )
}
