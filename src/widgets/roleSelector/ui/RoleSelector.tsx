import { USER_ROLES } from "@/entities/user/model/user.constants"
import { User, Stethoscope, Hospital } from "lucide-react"
import type { RoleSelectorProps } from "../types/types"
import { cn } from "@/shared/lib/utils"

const roles = [
  {
    type: USER_ROLES.PATIENT,
    title: "Пациент",
    description: "Поиск клиник и врачей, запись на консультации, отзывы",
    icon: User,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    type: USER_ROLES.DOCTOR,
    title: "Врач",
    description: "Управление расписанием, пациентами и услугами",
    icon: Stethoscope,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    type: USER_ROLES.CLINIC,
    title: "Клиника",
    description: "Управление клиникой, специалистами и услугами",
    icon: Hospital,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
]

export const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="space-child grid w-full">
      {roles.map((role) => (
        <button
          key={role.type}
          onClick={() => onRoleSelect(role.type)}
          className={cn(
            "group relative flex flex-col rounded-xl border-2 border-[#E5E7EB] p-6",
            "overflow-hidden bg-white hover:border-[#0070ff]",
            "cursor-pointer transition-all duration-200",
            "text-left focus:ring-2 focus:ring-[#0070ff] focus:ring-offset-2 focus:outline-none",
          )}
        >
          {role.icon && (
            <div
              className={cn(
                "absolute top-4 right-4 flex items-center justify-center",
                "opacity-10 transition-opacity group-hover:opacity-20",
                role.iconColor,
              )}
            >
              <role.icon className="size-24" />
            </div>
          )}

          <h3 className="relative z-10 mb-2 text-lg font-semibold text-[#1A1B23] transition-colors group-hover:text-[#0070ff]">
            {role.title}
          </h3>

          {role.description && (
            <p className="relative z-10 text-sm leading-relaxed text-[#6B7280]">
              {role.description}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}
