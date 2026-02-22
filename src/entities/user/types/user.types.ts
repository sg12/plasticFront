import type { GENDER, MODERATION_STATUS, ROLE } from "../model/user.constants"

export interface User {
  readonly id: string
  email: string
  phone?: string
  role: ROLE
  fullName: string
  avatar?: string
  language: string
  timezone: string
  leadSource?: string
  status: MODERATION_STATUS
  moderationComment: string | null
  aiToken: number
}

export interface Patient extends User {
  birthdate: string | null
  gender: GENDER | null
  medicalNotes: string | null
  bloodType: string | null
  allergies: string[]
  chronicDiseases: string | null
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
}

export type ROLE = keyof typeof ROLE
export type GENDER = keyof typeof GENDER
export type MODERATION_STATUS = keyof typeof MODERATION_STATUS
