import { z } from "zod"
import { SPECIALIZATION } from "@/entities/doctor/model/doctor.constants"
import { SERVICE_CATEGORY } from "./service.constants"

export const ServiceSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid().optional(),
  doctorId: z.uuid().optional(),
  title: z.string().min(2, "Название услуги слишком короткое").max(255),
  description: z.string().optional(),
  specialization: z.enum(SPECIALIZATION),
  category: z.enum(SERVICE_CATEGORY),
  price: z.coerce.number().min(0, "Цена не может быть отрицательной"),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const CreateServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Название услуги не может быть пустым")
    .max(255, "Название слишком длинное (макс. 255 символов)"),
  description: z.string().optional().or(z.null()),
  specialization: z.enum(SPECIALIZATION),
  category: z.enum(SERVICE_CATEGORY),
  price: z.coerce.number().min(0, "Цена не может быть отрицательной").optional().or(z.null()),
})

export const UpdateServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Название не может быть пустым")
    .max(255, "Название слишком длинное")
    .optional(),
  description: z.string().optional(),
  specialization: z.enum(SPECIALIZATION).optional(),
  category: z.enum(SERVICE_CATEGORY).optional(),
  price: z.coerce.number().min(0, "Цена не может быть отрицательной").optional(),

  isActive: z.boolean().optional(),
})

export const ArchiveServiceSchema = z.object({
  reason: z.string().max(500, "Причина архивации не должна превышать 500 символов").optional(),
})

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>
export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>
export type ArchiveServiceDto = z.infer<typeof ArchiveServiceSchema>
