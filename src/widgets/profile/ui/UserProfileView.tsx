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
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Дата рождения
            </label>
            <p className="text-sm">
              {profile.birthDate
                ? format(new Date(profile.birthDate), "dd MMMM yyyy", { locale: ru })
                : "—"}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Пол
            </label>
            <p className="text-sm">
              {profile.gender === "male"
                ? "Мужской"
                : profile.gender === "female"
                  ? "Женский"
                  : "—"}
            </p>
          </div>
        </div>
      )
    }

    if (profile.role === USER_ROLES.DOCTOR) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Дата рождения
            </label>
            <p className="text-sm">
              {profile.birthDate
                ? format(new Date(profile.birthDate), "dd MMMM yyyy", { locale: ru })
                : "—"}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Пол
            </label>
            <p className="text-sm">
              {profile.gender === "male"
                ? "Мужской"
                : profile.gender === "female"
                  ? "Женский"
                  : "—"}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Номер лицензии
            </label>
            <p className="text-sm">{profile.licenseNumber?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4" />
              Специализация
            </label>
            <p className="text-sm">{profile.specialization?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4" />
              Опыт работы
            </label>
            <p className="text-sm">
              {profile.experience ? pluralRu(profile.experience, "год", "года", "лет") : "—"}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Образование
            </label>
            <p className="text-sm">{profile.education?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Место работы
            </label>
            <p className="text-sm">{profile.workplace?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 text-sm font-medium">ИНН</label>
            <p className="text-sm">{profile.inn?.trim() || "—"}</p>
          </div>
        </div>
      )
    }

    if (profile.role === USER_ROLES.CLINIC) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Юридическое название
            </label>
            <p className="text-sm">{profile.legalName?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 text-sm font-medium">ИНН</label>
            <p className="text-sm">{profile.clinicInn?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 text-sm font-medium">ОГРН</label>
            <p className="text-sm">{profile.ogrn?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Номер лицензии
            </label>
            <p className="text-sm">{profile.clinicLicense?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Юридический адрес
            </label>
            <p className="text-sm">{profile.legalAddress?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Фактический адрес
            </label>
            <p className="text-sm">{profile.actualAddress?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              ФИО директора
            </label>
            <p className="text-sm">{profile.directorName?.trim() || "—"}</p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4" />
              Должность директора
            </label>
            <p className="text-sm">{profile.directorPosition?.trim() || "—"}</p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Личная информация</CardTitle>
      </CardHeader>

      <CardContent className="space-child">
        {/* Основная информация */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              {profile.role === USER_ROLES.CLINIC ? "Название клиники" : "Полное имя"}
            </label>
            <p className="text-sm">{profile.fullName?.trim() || "—"}</p>
          </div>

          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="flex items-center gap-2 text-sm">
              <span className="min-w-0 truncate">{profile.email?.trim() || "—"}</span>
              {profile.email && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" />}
            </p>
          </div>

          <div>
            <label className="text-muted-foreground mb-1.5 flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Телефон
            </label>
            <p className="min-w-0 truncate text-sm">{profile.phone?.trim() || "—"}</p>
          </div>
        </div>

        <Separator />

        {/* Ролевая информация */}
        {renderRoleSpecificInfo()}
      </CardContent>
    </Card>
  )
}
