import { z } from "zod"
import { RELATIONSHIP_STATUS } from "./relationship.constants"

export const RelationshipSchema = z.object({
  id: z.uuid(),
  doctorId: z.uuid(),
  clinicId: z.uuid(),
  status: z.enum(RELATIONSHIP_STATUS),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
