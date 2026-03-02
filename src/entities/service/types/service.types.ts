import type { SPECIALIZATION } from "@/entities/doctor/types/doctor.types"
import type { SERVICE_CATEGORY } from "../model/service.constants"

export interface Service {
  id: string
  clinicId: string | null
  doctorId: string | null
  title: string
  description: string | null
  specialization: SPECIALIZATION
  category: SERVICE_CATEGORY
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type SERVICE_CATEGORY = keyof typeof SERVICE_CATEGORY
