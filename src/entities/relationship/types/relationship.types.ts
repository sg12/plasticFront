import type { Clinic, Doctor } from "@/entities/user/types/user.types"
import type { RELATIONSHIP_STATUS } from "../model/relationship.constants"

export interface Relationship {
  id: string
  doctorId: string
  clinicId: string
  status: RELATIONSHIP_STATUS
  createdAt: string
  updatedAt: string
  doctor: Doctor
  clinic: Clinic
}

export type RELATIONSHIP_STATUS = keyof typeof RELATIONSHIP_STATUS
