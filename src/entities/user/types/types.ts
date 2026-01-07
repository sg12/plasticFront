import type { userCreateSchema, userUpdateSchema } from "@/entities/user/model/schema"
import type { MODERATION_STATUS, USER_ROLES } from "../model/constants"
import type z from "zod"

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export type Gender = "male" | "female"

export type RoleProfile = PatientProfile | DoctorProfile | ClinicProfile

export type ModerationStatus = (typeof MODERATION_STATUS)[keyof typeof MODERATION_STATUS]

export interface Profile {
  readonly id: string
  readonly role: UserRole
  fullName: string | null
  email: string
  phone: string | null
  moderationStatus: ModerationStatus | null
  moderationComment: string | null
  createdAt?: string
  updatedAt?: string
  moderatedAt: string | null
}

export interface PatientProfile extends Profile {
  birthDate: string | null
  gender: Gender
}

export interface DoctorProfile extends Profile {
  gender: Gender
  birthDate: string | null
  licenseNumber: string
  specialization: string
  experience: number
  education: string
  workplace: string
  inn: string
  documents: Record<string, string | string[]> | null
}

export interface ClinicProfile extends Profile {
  legalName: string
  clinicInn: string
  ogrn: string
  legalAddress: string
  actualAddress: string
  clinicLicense: string
  directorName: string
  directorPosition: string
  documents: Record<string, string | string[]> | null
}

export type UserCreateFormData = z.infer<typeof userCreateSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>