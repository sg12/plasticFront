import type { Appointment } from "@/entities/appointment/types/appointment.types"
import type { MODERATION_STATUS, USER_GENDER, USER_ROLE } from "../model/user.constants"
import type { File } from "@/entities/file/types/file.types"
import type { Break, Schedule, TimeSlot, WorkRule } from "@/entities/schedule/types/schedule.types"
import type { Notification } from "@/entities/notification/types/notification.types"
import type { Review } from "@/entities/review/types/review.types"
import type { Relationship } from "@/entities/relationship/types/relationship.types"
import type { Service } from "@/entities/service/types/service.types"
import type { UserConsents } from "@/entities/consent/types/consent.types"
import type { SPECIALIZATION } from "@/entities/doctor/types/doctor.types"
import type { Ticket } from "@/entities/support/types/support.types"
import type { Auth } from "@/entities/auth/types/auth.types"

export interface User {
  user: any
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
  notifications: Notification[]
  userConsents: UserConsents[]
  tickets: Ticket[]
  auth: Auth
  patient: Patient
  doctor: Doctor
  clinic: Clinic
}

export interface Patient {
  birthdate: string | null
  gender: GENDER | null
  medicalNotes: string | null
  bloodType: string | null
  allergies: string[]
  chronicDiseases: string | null
  createdAt: string
  updatedAt: string
  appointments: Appointment[]
  favorites: Favorite[]
  reviews: Review[]
  documents: File[]
}

export interface Doctor {
  gender: GENDER
  birthdate: string
  experience: number
  specializations: SPECIALIZATION[]
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
  relationships: Relationship[]
  favoriteByPatients: Favorite[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  workRules: WorkRule[]
  services: Service[]
  reviews: Review[]
  breaks: Break[]
}

export interface Clinic {
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
  relationships: Relationship[]
  appointments: Appointment[]
  favoriteByPatients: Favorite[]
  documents: File[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
  services: Service[]
  reviews: Review[]
}

export interface Favorite {
  id: string
  userId: string
  doctorId: string | null
  clinicId: string | null
  addedAt: string
}

export type ROLE = keyof typeof USER_ROLE
export type GENDER = keyof typeof USER_GENDER
export type MODERATION_STATUS = keyof typeof MODERATION_STATUS
