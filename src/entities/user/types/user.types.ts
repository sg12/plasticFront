import type { Appointment } from "@/entities/appointment/types/appointment.types"
import type { GENDER, MODERATION_STATUS, ROLE } from "../model/user.constants"
import type { File } from "@/entities/file/types/file.types"
import type { Break, Schedule, TimeSlot, WorkRule } from "@/entities/schedule/types/schedule.types"

export interface User {
  readonly id: string
  email: string
  phone: string | null
  role: ROLE
  fullName: string
  avatar: string | null
  language: string
  timezone: string
  leadSource: string | null
  status: MODERATION_STATUS
  moderationComment: string | null
  aiToken: number
  createdAt: string
  updatedAt: string
  // notifications: Notification[]
  // userConsents: UserConsent[]
  // tickets: Ticket[]
}

export interface Patient extends User {
  birthdate: string | null
  gender: GENDER | null
  medicalNotes: string | null
  bloodType: string | null
  allergies: string[]
  chronicDiseases: string | null
  createdAt: string
  updatedAt: string
  appointments: Appointment[]
  // favorites:       Favorite[]
  // reviews:         Review[]
  documents: File[]
}

export interface Doctor extends User {
  gender: GENDER | null
  birthdate: string | null
  experience: number
  specializations: string[]
  education: string
  workplace: string | null
  bio: string | null
  isActive: boolean
  isSearchable: boolean
  inn: string
  license: string
  rating: number
  createdAt: string
  updatedAt: string
  appointments: Appointment[]
  documents: File[]
  // relationships:      Relationship[]
  // favoriteByPatients: Favorite[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  workRules: WorkRule[]
  // services:           Service[]
  breaks: Break[]
  // reviews:            Review[]
}

export interface Clinic extends User {
  legalName: string
  brandName: string | null
  inn: string
  ogrn: string
  license: string
  directorName: string
  directorPosition: string
  legalAddress: string
  actualAddress: string
  city: string | null
  website: string | null
  description: string | null
  isActive: boolean
  rating: number
  createdAt: string
  updatedAt: string
  // relationships:      Relationship[]
  appointments: Appointment[]
  // favoriteByPatients: Favorite[]
  documents: File[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  // services:           Service[]
  // reviews:            Review[]
}

export type ROLE = keyof typeof ROLE
export type GENDER = keyof typeof GENDER
export type MODERATION_STATUS = keyof typeof MODERATION_STATUS
