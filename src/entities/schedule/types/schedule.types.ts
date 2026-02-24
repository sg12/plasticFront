import type { Appointment } from "@/entities/appointment/types/appointment.types"
import type { BREAK_TYPE, RULE_TYPE, SLOT_STATUS } from "../model/schedule.constants"

export interface Schedule {
  id: string
  doctorId: string | null
  clinicId: string | null
  dayOfWeek: number
  startAt: string
  entAt: string
  slotDuration: number
}

export interface Break {
  id: string
  doctorId: string
  type: BREAK_TYPE
  startAt: string | null
  endAt: string | null
}

export interface WorkRule {
  id: string
  doctorId: string
  type: RULE_TYPE
  startTime: string
  endTime: string
}

export interface TimeSlot {
  id: string
  doctorId: string | null
  clinicId: string | null
  startAt: string
  endAt: string
  status: SLOT_STATUS
  createdAt: string
  updatedAt: string
  appointment: Appointment | null
}

export type BREAK_TYPE = keyof typeof BREAK_TYPE
export type RULE_TYPE = keyof typeof RULE_TYPE
export type SLOT_STATUS = keyof typeof SLOT_STATUS
