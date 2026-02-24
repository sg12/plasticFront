import z from "zod"
import { ROLE } from "@/entities/user/model/user.constants"
import { SPECIALIZATION } from "@/entities/doctor/model/doctor.constants"

export const CatalogQuerySchema = z.object({
  role: z.enum([ROLE.DOCTOR, ROLE.CLINIC]).optional(),
  search: z.string().optional(),
  specializations: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.enum(SPECIALIZATION)).optional(),
  ),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(50).default(10),
})

export type CatalogQueryDto = z.infer<typeof CatalogQuerySchema>
