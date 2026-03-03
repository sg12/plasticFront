import z from "zod"
import { BREAK_TYPE, RULE_TYPE, SLOT_STATUS } from "./schedule.constants"
import { AppointmentSchema } from "@/entities/appointment/model/appointment.schema"

const SlotStatusSchema = z.enum(SLOT_STATUS)
const BreakTypeSchema = z.enum(BREAK_TYPE)
const RuleTypeSchema = z.enum(RULE_TYPE)

export const ScheduleSchema = z.object({
  id: z.uuid(),
  doctorId: z.uuid().nullable(),
  clinicId: z.uuid().nullable(),
  dayOfWeek: z.number().min(0).max(6),
  startAt: z.string(),
  entAt: z.string(),
  slotDuration: z.number(),
})

export const TimeSlotSchema = z.object({
  id: z.uuid(),
  doctorId: z.uuid().nullable(),
  clinicId: z.uuid().nullable(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  status: SlotStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  appointment: AppointmentSchema.nullable().optional(),
})

export const WorkRuleSchema = z.object({
  id: z.uuid(),
  doctorId: z.uuid(),
  type: RuleTypeSchema,
  startTime: z.string(),
  endTime: z.string(),
})

export const BreakSchema = z.object({
  id: z.uuid(),
  doctorId: z.uuid(),
  type: BreakTypeSchema,
  startAt: z.iso.datetime().nullable(),
  endAt: z.iso.datetime().nullable(),
})

export const updateScheduleSchema = z
  .object({
    isAvailable: z.boolean().optional(),
    startAt: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Неверный формат времени (ЧЧ:ММ)")
      .optional(),

    endAt: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Неверный формат времени (ЧЧ:ММ)")
      .optional(),

    slotDuration: z.number().min(5).max(120).optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        const [startHours, startMinutes] = data.startAt.split(":").map(Number)
        const [endHours, endMinutes] = data.endAt.split(":").map(Number)

        const startTime = startHours * 60 + startMinutes
        const endTime = endHours * 60 + endMinutes

        return endTime > startTime
      }
      return true
    },
    {
      message: "Время окончания должно быть позже времени начала",
      path: ["endAt"],
    },
  )

export type ScheduleDto = z.infer<typeof ScheduleSchema>
export type TimeSlotDto = z.infer<typeof TimeSlotSchema>
export type WorkRuleDto = z.infer<typeof WorkRuleSchema>
export type BreakDto = z.infer<typeof BreakSchema>
export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>
