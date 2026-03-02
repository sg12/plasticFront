import type { Rating } from "@/entities/rating/types/rating.types"
import type { REVIEW_STATUS } from "../model/review.constants"

export interface Review {
  id: string
  patientId: string
  doctorId: string | null
  clinicId: string | null
  moderationId: string | null
  rating: Rating | null
  text: string
  status: REVIEW_STATUS
  createdAt: string
  updatedAt: string
}

export type REVIEW_STATUS = keyof typeof REVIEW_STATUS
