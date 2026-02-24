import z from "zod"

export const RatingSchema = z.object({
  id: z.uuid(),
  patientId: z.uuid(),
  value: z.int(),
  doctorId: z.uuid().optional(),
  clinicId: z.uuid().optional(),
  reviewId: z.uuid().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const UpdateRatingSchema = z.object({
  value: z.coerce
    .number()
    .min(0.5, "Минимальное значение рейтинга — 0.5")
    .max(5.0, "Максимальное значение рейтинга — 5.0")
    .refine((val) => (val * 10) % 5 === 0, {
      message: "Шаг рейтинга должен быть равен 0.5",
    }),
})

export type UpdateRatingDto = z.infer<typeof UpdateRatingSchema>
