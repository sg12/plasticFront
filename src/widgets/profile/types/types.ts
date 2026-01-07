import type { RoleProfile } from "../../../entities/user/types/types"

export interface Props {
  profile: RoleProfile | null
  isEditing?: boolean
}
