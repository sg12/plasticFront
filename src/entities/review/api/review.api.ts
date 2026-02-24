import { api } from "@/shared/api/axiosInstance"
import type { Review } from "../types/review.types"
import type { CreateReviewDto } from "../model/review.schema"

export const getReviews = async (): Promise<Review[]> => {
  const { data } = await api.get("reviews")
  return data
}

export const createReview = async (
  targetId: string,
  createReviewDto: CreateReviewDto,
): Promise<Review> => {
  const { data } = await api.post(`review/${targetId}`, createReviewDto)
  return data
}
