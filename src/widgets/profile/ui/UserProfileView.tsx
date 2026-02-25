import { CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"
import {
  CheckCircle,
  Mail,
  Phone,
  UserIcon,
  FileText,
  Building2,
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react"
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
            <InfoItem icon={<Calendar />} label="Дата рождения" value={user.patient.birthdate} />
            <InfoItem icon={<UserIcon />} label="Пол" value={user.patient.gender} />
          </div>
        );

      case USER_ROLE.DOCTOR:
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoItem icon={<Calendar />} label="Дата рождения" value={user.doctor.birthdate} />
            <InfoItem icon={<FileText />} label="Лицензия" value={user.doctor.license} />
            <InfoItem icon={<Briefcase />} label="Специализация" value={user.doctor.specializations.join(", ")} />
            <InfoItem icon={<Briefcase />} label="Опыт" value={`${user.doctor.experience} лет`} />
            <InfoItem icon={<GraduationCap />} label="Образование" value={user.doctor.education} />
            <InfoItem label="ИНН" value={user.doctor.inn} />
          </div>
        );

      case USER_ROLE.CLINIC:
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoItem icon={<Building2 />} label="Юр. название" value={user.clinic.legalName} />
            <InfoItem label="ИНН" value={user.clinic.inn} />
            <InfoItem label="ОГРН" value={user.clinic.ogrn} />
            <InfoItem icon={<MapPin />} label="Адрес" value={user.clinic.actualAddress} />
            <InfoItem icon={<UserIcon />} label="Директор" value={user.clinic.directorName} />
          </div>
        );
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <CardTitle className="text-xl">Личная информация</CardTitle>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoItem
          icon={<UserIcon />}
          label={user.role === USER_ROLE.CLINIC ? "Название клиники" : "Полное имя"}
          value={user.fullName}
        />
        <InfoItem icon={<Mail />} label="Email" value={user.email} isVerified />
        <InfoItem icon={<Phone />} label="Телефон" value={user.phone} />
      </div>

      <Separator />

      {roleContent}
    </div>
  );
};

const InfoItem = ({ icon, label, value, isVerified }: {
  icon?: React.ReactNode,
  label: string,
  value?: string | null,
  isVerified?: boolean
}) => (
  <div>
    <label className="text-muted-foreground mb-1 flex items-center gap-2 text-sm font-medium">
      {icon && <span className="size-4 opacity-70">{icon}</span>}
      {label}
    </label>
    <div className="flex items-center gap-2 text-sm">
      <span className="truncate">{value?.trim() || "—"}</span>
      {isVerified && value && <CheckCircle className="size-3.5 text-green-600 shrink-0" />}
    </div>
  </div>
)