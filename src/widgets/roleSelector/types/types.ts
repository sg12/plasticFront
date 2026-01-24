import type { UserRole } from "@/entities/user/types/types"

export interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
}
