import type { UserRole } from "@/entities/user/types/user.types"

export interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
}
