import z from "zod"
import { REVIEW_STATUS } from "./review.constants"
import { RatingSchema } from "@/entities/rating/model/rating.schema"

export const ReviewSchema = z.object({
  id: z.uuid(),
  patientId: z.uuid(),
  doctorId: z.uuid().optional(),
  clinicId: z.uuid().optional(),
  moderationId: z.uuid().optional(),
  rating: RatingSchema.optional(),
  text: z.string().min(1, "Текст отзыва не может быть пустым"),
  status: z.enum(REVIEW_STATUS),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const CreateReviewSchema = z.object({
  text: z.string(),
})

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>
