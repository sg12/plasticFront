import { USER_ROLES } from "@/entities/user/model/constants"
import z from "zod"

export const genderSchema = z.enum(["male", "female"])

export const birthDateSchema = z.date("Дата рождения обязательна").refine(
  (date) => {
    const today = new Date()
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth())
    return date <= eighteenYearsAgo
  },
  {
    message: "Вам должно быть не менее 18 лет",
  },
)

const documentsSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())])).nullable()

export const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Введите ФИО"),
  email: z.email("Неверный формат email"),
  phone: z.string().min(10, "Неверный номер телефона"),
  password: z.string().min(6, "Минимум 6 символов").optional(),
  confirmPassword: z.string().optional(),
})

export const patientInfoSchema = z.object({
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
})

export const doctorInfoSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, "Номер лицензии обязателен")
    .min(3, "Номер лицензии должен содержать минимум 3 символа"),
  specialization: z
    .string()
    .min(1, "Укажите специализацию")
    .min(2, "Специализация должна содержать минимум 2 символа"),
  experience: z
    .number()
    .min(0, "Опыт не может быть отрицательным")
    .max(60, "Опыт не может быть больше 60 лет")
    .refine((val) => val > 0, { message: "Укажите опыт работы" }),
  education: z
    .string()
    .min(1, "Укажите образование")
    .min(2, "Образование должно содержать минимум 2 символа"),
  workplace: z.string().min(2, "Укажите место работы").or(z.literal("")).nullable().optional(),
  clinic: z.uuid("Неверный формат UUID клиники").nullable().optional(),
  inn: z.string().min(1, "ИНН обязателен").length(10, "ИНН должен быть 10 цифр"),
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
  documents: documentsSchema,
})

export const clinicInfoSchema = z.object({
  legalName: z
    .string()
    .min(1, "Введите юридическое название")
    .min(2, "Юридическое название должно содержать минимум 2 символа"),
  clinicInn: z
    .string()
    .min(1, "ИНН клиники обязателен")
    .length(10, "ИНН клиники должен содержать 10 цифр"),
  ogrn: z.string().min(1, "ОГРН обязателен").length(13, "ОГРН должен содержать 13 цифр"),
  legalAddress: z
    .string()
    .min(1, "Укажите юридический адрес")
    .min(5, "Юридический адрес должен содержать минимум 5 символов"),
  actualAddress: z
    .string()
    .min(1, "Укажите фактический адрес")
    .min(5, "Фактический адрес должен содержать минимум 5 символов"),
  clinicLicense: z
    .string()
    .min(1, "Номер лицензии обязателен")
    .min(5, "Номер лицензии должен содержать минимум 5 символов"),
  directorName: z
    .string()
    .min(1, "Введите ФИО директора")
    .min(2, "ФИО директора должно содержать минимум 2 символа"),
  directorPosition: z
    .string()
    .min(1, "Укажите должность директора")
    .min(2, "Должность директора должна содержать минимум 2 символа"),
  documents: documentsSchema,
})

export const userCreateSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(USER_ROLES.PATIENT),
    // Базовые поля (опциональны при создании, т.к. берутся из сессии)
    fullName: z.string().min(2, "Введите ФИО").optional(),
    email: z.email("Неверный формат email").optional(),
    phone: z.string().min(10, "Неверный номер телефона").optional(),
    // Ролевые поля
    birthDate: birthDateSchema.optional(),
    gender: genderSchema.optional(),
  }),
  z.object({
    role: z.literal(USER_ROLES.DOCTOR),
    // Базовые поля (опциональны при создании, т.к. берутся из сессии)
    fullName: z.string().min(2, "Введите ФИО").optional(),
    email: z.email("Неверный формат email").optional(),
    phone: z.string().min(10, "Неверный номер телефона").optional(),
    // Ролевые поля
    licenseNumber: z
      .string()
      .min(1, "Номер лицензии обязателен")
      .min(3, "Номер лицензии должен содержать минимум 3 символа"),
    specialization: z
      .string()
      .min(1, "Укажите специализацию")
      .min(2, "Специализация должна содержать минимум 2 символа"),
    experience: z
      .number()
      .min(0, "Опыт не может быть отрицательным")
      .max(60, "Опыт не может быть больше 60 лет")
      .refine((val) => val > 0, { message: "Укажите опыт работы" }),
    education: z
      .string()
      .min(1, "Укажите образование")
      .min(2, "Образование должно содержать минимум 2 символа"),
    workplace: z.string().min(2, "Укажите место работы").or(z.literal("")).nullable().optional(),
    clinic: z.uuid("Неверный формат UUID клиники").nullable().optional(),
    inn: z.string().min(1, "ИНН обязателен").length(10, "ИНН должен быть 10 цифр"),
    birthDate: birthDateSchema.optional(),
    gender: genderSchema.optional(),
    documents: documentsSchema,
  }),
  z.object({
    role: z.literal(USER_ROLES.CLINIC),
    // Базовые поля (опциональны при создании, т.к. берутся из сессии)
    fullName: z.string().min(2, "Введите ФИО").optional(),
    email: z.email("Неверный формат email").optional(),
    phone: z.string().min(10, "Неверный номер телефона").optional(),
    // Ролевые поля
    legalName: z
      .string()
      .min(1, "Введите юридическое название")
      .min(2, "Юридическое название должно содержать минимум 2 символа"),
    clinicInn: z
      .string()
      .min(1, "ИНН клиники обязателен")
      .length(10, "ИНН клиники должен содержать 10 цифр"),
    ogrn: z.string().min(1, "ОГРН обязателен").length(13, "ОГРН должен содержать 13 цифр"),
    legalAddress: z
      .string()
      .min(1, "Укажите юридический адрес")
      .min(5, "Юридический адрес должен содержать минимум 5 символов"),
    actualAddress: z
      .string()
      .min(1, "Укажите фактический адрес")
      .min(5, "Фактический адрес должен содержать минимум 5 символов"),
    clinicLicense: z
      .string()
      .min(1, "Номер лицензии обязателен")
      .min(5, "Номер лицензии должен содержать минимум 5 символов"),
    directorName: z
      .string()
      .min(1, "Введите ФИО директора")
      .min(2, "ФИО директора должно содержать минимум 2 символа"),
    directorPosition: z
      .string()
      .min(1, "Укажите должность директора")
      .min(2, "Должность директора должна содержать минимум 2 символа"),
    documents: documentsSchema,
    doctors: z.array(z.uuid("Неверный формат UUID врача")).default([]),
  }),
])

export const userUpdateSchema = z.object({
  // Базовые поля
  fullName: z.string().min(2, "Введите ФИО").optional(),
  email: z.email("Неверный формат email").optional(),
  phone: z.string().min(10, "Неверный номер телефона").optional(),
  aiTokenUsed: z.number().optional(),
  // Ролевые поля (все опциональны при обновлении)
  role: z.enum(["patient", "doctor", "clinic"]).optional(),
  // Patient
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
  // Doctor
  licenseNumber: z
    .string()
    .min(1, "Номер лицензии обязателен")
    .min(3, "Номер лицензии должен содержать минимум 3 символа")
    .optional(),
  specialization: z
    .string()
    .min(1, "Укажите специализацию")
    .min(2, "Специализация должна содержать минимум 2 символа")
    .optional(),
  experience: z
    .number()
    .min(0, "Опыт не может быть отрицательным")
    .max(60, "Опыт не может быть больше 60 лет")
    .refine((val) => val > 0, { message: "Укажите опыт работы" })
    .optional(),
  education: z
    .string()
    .min(1, "Укажите образование")
    .min(2, "Образование должно содержать минимум 2 символа")
    .optional(),
  workplace: z.string().min(2, "Укажите место работы").or(z.literal("")).nullable().optional(),
  clinic: z.uuid("Неверный формат UUID клиники").nullable().optional(),
  inn: z.string().min(1, "ИНН обязателен").length(10, "ИНН должен быть 10 цифр").optional(),
  // Clinic
  legalName: z
    .string()
    .min(1, "Введите юридическое название")
    .min(2, "Юридическое название должно содержать минимум 2 символа")
    .optional(),
  clinicInn: z
    .string()
    .min(1, "ИНН клиники обязателен")
    .length(10, "ИНН клиники должен содержать 10 цифр")
    .optional(),
  ogrn: z.string().min(1, "ОГРН обязателен").length(13, "ОГРН должен содержать 13 цифр").optional(),
  legalAddress: z
    .string()
    .min(1, "Укажите юридический адрес")
    .min(5, "Юридический адрес должен содержать минимум 5 символов")
    .optional(),
  actualAddress: z
    .string()
    .min(1, "Укажите фактический адрес")
    .min(5, "Фактический адрес должен содержать минимум 5 символов")
    .optional(),
  clinicLicense: z
    .string()
    .min(1, "Номер лицензии обязателен")
    .min(5, "Номер лицензии должен содержать минимум 5 символов")
    .optional(),
  directorName: z
    .string()
    .min(1, "Введите ФИО директора")
    .min(2, "ФИО директора должно содержать минимум 2 символа")
    .optional(),
  directorPosition: z
    .string()
    .min(1, "Укажите должность директора")
    .min(2, "Должность директора должна содержать минимум 2 символа")
    .optional(),
  documents: documentsSchema.optional(),
  doctors: z.array(z.uuid("Неверный формат UUID врача")).optional(),
})
