import z from "zod"
import { GENDER, MODERATION_STATUS, ROLE } from "./user.constants"
import { SPECIALIZATION } from "@/entities/doctor/model/doctor.constants"

export const RoleSchema = z.enum(ROLE)
export const GenderSchema = z.enum(GENDER)
export const ModerationStatusSchema = z.enum(MODERATION_STATUS)

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email("Некорректный email"),
  phone: z.string().optional(),
  role: RoleSchema,
  fullName: z.string().min(2, "Введите полное имя"),
  avatar: z.url().optional(),
  language: z.string().default("ru"),
  timezone: z.string().default("Asia/Novosibirsk"),
  leadSource: z.string().optional(),
  status: ModerationStatusSchema,
  moderationComment: z.string().nullable(),
  aiToken: z.number().int(),
})

export const PatientProfileSchema = z.object({
  birthdate: z.iso.datetime().nullable(),
  gender: GenderSchema.nullable(),
  medicalNotes: z.string().nullable(),
  bloodType: z.string().nullable(),
  allergies: z.array(z.string()).default([]),
  chronicDiseases: z.string().nullable(),
})

export const DoctorProfileSchema = z.object({
  gender: GenderSchema.nullable(),
  birthdate: z.iso.datetime().nullable(),
  experience: z.number().min(0).max(60),
  specializations: z.array(z.enum(SPECIALIZATION)),
  education: z.string().min(2),
  workplace: z.string().nullable(),
  bio: z.string().nullable(),
  isActive: z.boolean(),
  isSearchable: z.boolean(),
  inn: z.string().regex(/^\d{10}(\d{2})?$/, "Некорректный ИНН"),
  license: z.string().min(3),
  rating: z.number().default(0),
})

export const ClinicProfileSchema = z.object({
  legalName: z.string().min(2),
  brandName: z.string().nullable(),
  inn: z.string().regex(/^\d{10}$/, "ИНН клиники должен быть 10 цифр"),
  ogrn: z.string().regex(/^\d{13}$/, "ОГРН должен быть 13 цифр"),
  license: z.string().min(5),
  directorName: z.string().min(2),
  directorPosition: z.string().min(2),
  legalAddress: z.string().min(5),
  actualAddress: z.string().min(5),
  city: z.string().nullable(),
  website: z.url().nullable().or(z.literal("")),
  description: z.string().nullable(),
  isActive: z.boolean(),
  rating: z.number().default(0),
})

export const CreateUserSchema = z.object({
  role: RoleSchema,
  fullName: z.string().min(2, "ФИО обязательно"),
  email: z.email("Введите корректный email"),
  phone: z.string().min(10, "Минимум 10 цифр").optional(),
  password: z.string().min(6, "Пароль от 6 символов"),
  acceptedConsentIds: z.array(z.string()).min(1, "Нужно принять соглашения"),
})

export const UpdateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  patient: PatientProfileSchema.partial().optional(),
  doctor: DoctorProfileSchema.partial().optional(),
  clinic: ClinicProfileSchema.partial().optional(),
})

export type UserDto = z.infer<typeof UserSchema>
export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

export type PatientDto = UserDto & z.infer<typeof PatientProfileSchema>
export type DoctorDto = UserDto & z.infer<typeof DoctorProfileSchema>
export type ClinicDto = UserDto & z.infer<typeof ClinicProfileSchema>
