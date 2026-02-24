import type { RELATIONSHIP_STATUS } from "../model/relationship.constants"

export interface Relationship {
  id: string
  doctorId: string
  clinicId: string
  status: RELATIONSHIP_STATUS
  createdAt: string
  updatedAt: string
}

export type RELATIONSHIP_STATUS = keyof typeof RELATIONSHIP_STATUS
