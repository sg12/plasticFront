import { USER_ROLES } from "@/entities/user/model/constants";
import { User, Stethoscope, Hospital } from "lucide-react";
import type { RoleSelectorProps } from "../types/types";
import { BannerButton } from "@/shared/ui/bannerButton";

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      type: USER_ROLES.PATIENT,
      title: "Пациент",
      description: "Поиск клиник и врачей, запись на консультации, отзывы",
      icon: User,
      styles: {
        border: "hover:border-purple-500",
        bg: "hover:bg-purple-50",
        iconBg: "group-hover:bg-purple-300 bg-purple-200",
        icon: "text-purple-600",
        chevron: "group-hover:text-purple-600",
      },
    },
    {
      type: USER_ROLES.DOCTOR,
      title: "Врач",
      description: "Управление расписанием, пациентами и услугами",
      icon: Stethoscope,
      styles: {
        border: "hover:border-orange-500",
        bg: "hover:bg-orange-50",
        iconBg: "group-hover:bg-orange-300 bg-orange-200",
        icon: "text-orange-600",
        chevron: "group-hover:text-orange-600",
      },
    },
    {
      type: USER_ROLES.CLINIC,
      title: "Клиника",
      description: "Управление клиникой, специалистами и услугами",
      icon: Hospital,
      styles: {
        border: "hover:border-green-500",
        bg: "hover:bg-green-50",
        iconBg: "group-hover:bg-green-300 bg-green-200",
        icon: "text-green-600",
        chevron: "group-hover:text-green-600",
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <BannerButton
            key={index}
            title={role.title}
            size="bannerXl"
            description={role.description}
            icon={role.icon}
            onClick={() => onRoleSelect(role.type)}
            colors={{
              border: role.styles.border,
              bg: role.styles.bg,
              iconBg: role.styles.iconBg,
              icon: role.styles.icon,
              chevron: role.styles.chevron,
            }}
          />
        ))}
      </div>
    </>
  );
}
