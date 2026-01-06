import type { MODERATION_STATUS, USER_ROLES } from "../model/constants"

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export type Gender = "male" | "female" | undefined

export type RoleProfile = PatientProfile | DoctorProfile | ClinicProfile

export type ModerationStatus = (typeof MODERATION_STATUS)[keyof typeof MODERATION_STATUS]

export interface Profile {
  readonly id: string
  readonly role: UserRole
  full_name: string | null
  email: string
  phone: string | null
  moderation_status: ModerationStatus | null
  moderation_comment: string | null
  created_at?: string
  updated_at?: string
  moderated_at: string | null
}

export interface PatientProfile extends Profile {
  birth_date: string | null
  gender: Gender
}

export interface DoctorProfile extends Profile {
  gender: Gender
  birth_date: string | null
  license_number: string
  specialization: string
  experience: number
  education: string
  workplace: string
  inn: string
  documents: Record<string, string | string[]> | null
}

export interface ClinicProfile extends Profile {
  legal_name: string
  clinic_inn: string
  ogrn: string
  legal_address: string
  actual_address: string
  clinic_license: string
  director_name: string
  director_position: string
  documents: Record<string, string | string[]> | null
}
