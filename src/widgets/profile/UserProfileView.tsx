import { CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"
import type { User } from "@/entities/user/types/user.types"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { useMemo } from "react"

interface UserProfileViewProps {
  user: User
}

/**
 * Компонент для отображения профиля в режиме только чтения
 * Используется для просмотра чужих профилей
 */
export const UserProfileView = ({ user }: UserProfileViewProps) => {
  const roleContent = useMemo(() => {
    switch (user.role) {
      case USER_ROLE.PATIENT:
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoItem label="Дата рождения" value={user.patient.birthdate} />
            <InfoItem label="Пол" value={user.patient.gender} />
          </div>
        );

      case USER_ROLE.DOCTOR:
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoItem label="Дата рождения" value={user.doctor.birthdate} />
            <InfoItem label="Лицензия" value={user.doctor.license} />
            <InfoItem label="Специализация" value={user.doctor.specializations.join(", ")} />
            <InfoItem label="Опыт" value={`${user.doctor.experience} лет`} />
            <InfoItem label="Образование" value={user.doctor.education} />
            <InfoItem label="ИНН" value={user.doctor.inn} />
          </div>
        );

      case USER_ROLE.CLINIC:
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoItem label="Юр. название" value={user.clinic.legalName} />
            <InfoItem label="ИНН" value={user.clinic.inn} />
            <InfoItem label="ОГРН" value={user.clinic.ogrn} />
            <InfoItem label="Адрес" value={user.clinic.actualAddress} />
            <InfoItem label="Директор" value={user.clinic.directorName} />
          </div>
        );
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <CardTitle className="text-xl">Личная информация</CardTitle>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoItem
          label={user.role === USER_ROLE.CLINIC ? "Название клиники" : "Полное имя"}
          value={user.fullName}
        />
        <InfoItem label="Email" value={user.email} />
        <InfoItem label="Телефон" value={user.phone} />
      </div>

      <Separator />

      {roleContent}
    </div>
  );
};

const InfoItem = ({ label, value }: {
  label: string,
  value?: string | null,
}) => (
  <div>
    <label className="text-mwuted-foreground mb-1 flex items-center gap-2 text-sm font-medium">
      {label}
    </label>
    <div className="flex items-center gap-2 text-sm">
      <span className="truncate">{value?.trim() || "—"}</span>
    </div>
  </div>
)