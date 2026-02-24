import { api } from "@/shared/api/axiosInstance"
import type { UpdateRatingDto } from "../model/rating.schema"
import type { Rating } from "../types/rating.types"

export const updateRating = async (
  targetId: string,
  updateRatingDto: UpdateRatingDto,
): Promise<Rating> => {
  const { data } = await api.patch<Rating>(`ratings/${targetId}`, {}, { params: updateRatingDto })
  return data
}
