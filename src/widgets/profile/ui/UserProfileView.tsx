import type { RoleProfile } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { formatRole } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { pluralRu } from "@/shared/lib/utils"
import {
  CheckCircle,
  Mail,
  Phone,
  User,
  FileText,
  Building2,
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react"

interface UserProfileViewProps {
  profile: RoleProfile
}

/**
 * Компонент для отображения профиля в режиме только чтения
 * Используется для просмотра чужих профилей
 */
export const UserProfileView = ({ profile }: UserProfileViewProps) => {
  const renderRoleSpecificInfo = () => {
    if (profile.role === USER_ROLES.PATIENT) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-500">Дата рождения</label>
            <p className="mt-1 text-sm">
              {profile.birthDate
                ? format(new Date(profile.birthDate), "dd MMMM yyyy", { locale: ru })
                : "—"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Пол</label>
            <p className="mt-1 text-sm">{profile.gender === "male" ? "Мужской" : "Женский"}</p>
          </div>
        </div>
      )
    }

    if (profile.role === USER_ROLES.DOCTOR) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-500">Дата рождения</label>
            <p className="mt-1 text-sm">
              {profile.birthDate
                ? format(new Date(profile.birthDate), "dd MMMM yyyy", { locale: ru })
                : "—"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Пол</label>
            <p className="mt-1 text-sm">{profile.gender === "male" ? "Мужской" : "Женский"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <FileText className="h-4 w-4" />
              Номер лицензии
            </label>
            <p className="mt-1 text-sm">{profile.licenseNumber || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Briefcase className="h-4 w-4" />
              Специализация
            </label>
            <p className="mt-1 text-sm">{profile.specialization || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Calendar className="h-4 w-4" />
              Опыт работы
            </label>
            <p className="mt-1 text-sm">
              {profile.experience ? pluralRu(profile.experience, "год", "года", "лет") : "—"}
            </p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <GraduationCap className="h-4 w-4" />
              Образование
            </label>
            <p className="mt-1 text-sm">{profile.education || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Building2 className="h-4 w-4" />
              Клиника
            </label>
            <p className="mt-1 text-sm">
              {profile.role === USER_ROLES.DOCTOR && profile.clinic && profile.workplace}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ИНН</label>
            <p className="mt-1 text-sm">{profile.inn || "—"}</p>
          </div>
        </div>
      )
    }

    if (profile.role === USER_ROLES.CLINIC) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Building2 className="h-4 w-4" />
              Юридическое название
            </label>
            <p className="mt-1 text-sm">{profile.legalName || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ИНН</label>
            <p className="mt-1 text-sm">{profile.clinicInn || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ОГРН</label>
            <p className="mt-1 text-sm">{profile.ogrn || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <FileText className="h-4 w-4" />
              Номер лицензии
            </label>
            <p className="mt-1 text-sm">{profile.clinicLicense || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <MapPin className="h-4 w-4" />
              Юридический адрес
            </label>
            <p className="mt-1 text-sm">{profile.legalAddress || "—"}</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <MapPin className="h-4 w-4" />
              Фактический адрес
            </label>
            <p className="mt-1 text-sm">{profile.actualAddress || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">ФИО директора</label>
            <p className="mt-1 text-sm">{profile.directorName || "—"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Должность директора</label>
            <p className="mt-1 text-sm">{profile.directorPosition || "—"}</p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            Личная информация
            <Badge variant="outline">{formatRole(profile.role)}</Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-child grid">
        {/* Основная информация */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <User className="h-4 w-4" />
              {profile.role === USER_ROLES.CLINIC ? "Название клиники" : "Полное имя"}
            </label>
            <p className="mt-1 text-sm">{profile.fullName || "—"}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="mt-1 flex items-center gap-2 text-sm">
              {profile.email || "—"}
              <CheckCircle className="h-3 w-3 text-green-500" />
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Phone className="h-4 w-4" />
              Телефон
            </label>
            <p className="mt-1 text-sm">{profile.phone || "—"}</p>
          </div>
        </div>

        <Separator />

        {/* Ролевая информация */}
        {renderRoleSpecificInfo()}
      </CardContent>
    </Card>
  )
}
