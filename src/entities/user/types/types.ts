/**
 * @fileoverview Типы и интерфейсы для работы с профилями пользователей системы.
 *
 * Модуль определяет систему типов для различных ролей пользователей (пациент, врач, клиника)
 * с использованием Discriminated Union для типобезопасности.
 *
 * @module entities/user/types
 *
 * @example
 * ```typescript
 * import { RoleProfile, TypedProfile, USER_ROLES } from "@/entities/user/types/types"
 *
 * // Работа с профилем любого типа
 * const profile: RoleProfile | null = await loadProfile()
 *
 * // Проверка типа с сужением типов
 * if (profile && profile.role === USER_ROLES.DOCTOR) {
 *   // profile автоматически имеет тип DoctorProfile
 *   console.log(profile.licenseNumber) // ✅ TypeScript знает, что это DoctorProfile
 * }
 *
 * // Использование дженериков для строгой типизации
 * function updateDoctor(profile: TypedProfile<typeof USER_ROLES.DOCTOR>) {
 *   profile.licenseNumber = "ABC123" // ✅ Работает
 *   // profile.legalName // ❌ Ошибка - нет такого поля в DoctorProfile
 * }
 * ```
 */

import type { userCreateSchema, userUpdateSchema } from "@/entities/user/model/schema"
import type { MODERATION_STATUS } from "../model/constants"
import { USER_ROLES } from "../model/constants"
import type z from "zod"

/**
 * Тип роли пользователя в системе.
 *
 * Значения: `"patient" | "doctor" | "clinic"`
 *
 * @example
 * ```typescript
 * const role: UserRole = USER_ROLES.DOCTOR
 * ```
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * Пол пользователя.
 *
 * @example
 * ```typescript
 * const gender: Gender = "male"
 * ```
 */
export type Gender = "male" | "female"

/**
 * Объединение всех возможных типов профилей.
 *
 * Discriminated Union: каждый профиль имеет уникальное поле `role` с литеральным типом,
 * что позволяет TypeScript автоматически сужать типы при проверке роли.
 *
 * @example
 * ```typescript
 * const profile: RoleProfile | null = await loadProfile()
 *
 * // TypeScript автоматически сужает тип при проверке
 * if (profile && profile.role === USER_ROLES.CLINIC) {
 *   // profile имеет тип ClinicProfile
 *   console.log(profile.legalName) // ✅ Доступно
 * }
 * ```
 */
export type RoleProfile = PatientProfile | DoctorProfile | ClinicProfile

/**
 * Статус модерации профиля.
 *
 * Значения: `"pending" | "approved" | "rejected"`
 *
 * @example
 * ```typescript
 * if (profile.moderationStatus === "approved") {
 *   // Профиль одобрен
 * }
 * ```
 */
export type ModerationStatus = (typeof MODERATION_STATUS)[keyof typeof MODERATION_STATUS]

/**
 * Базовый интерфейс профиля пользователя.
 *
 * Содержит общие поля, которые есть у всех типов профилей.
 *
 * @remarks
 * Поле `role` имеет тип `UserRole`, но в конкретных профилях оно переопределяется
 * на литеральный тип для работы Discriminated Union.
 *
 * @example
 * ```typescript
 * const baseProfile: Profile = {
 *   id: "123",
 *   role: USER_ROLES.PATIENT,
 *   fullName: "Иван Иванов",
 *   email: "ivan@example.com",
 *   // ...
 * }
 * ```
 */
export interface Profile {
  /** Уникальный идентификатор профиля (UUID) */
  readonly id: string
  /** Роль пользователя в системе */
  readonly role: UserRole
  /** Полное имя пользователя */
  fullName: string | null
  /** Email адрес (обязательное поле) */
  email: string
  /** Номер телефона */
  phone: string | null
  /** Статус модерации профиля */
  moderationStatus: ModerationStatus | null
  /** Комментарий модератора при отклонении/одобрении */
  moderationComment: string | null
  /** Дата создания профиля (ISO строка) */
  createdAt?: string
  /** Дата последнего обновления (ISO строка) */
  updatedAt?: string
  /** Дата модерации (ISO строка) */
  moderatedAt: string | null
  /** Количество токенов, потраченных на AI визуализацию */
  aiTokensUsed: number | null
}

/**
 * Профиль пациента.
 *
 * Расширяет базовый `Profile` специфичными для пациента полями.
 *
 * @example
 * ```typescript
 * const patient: PatientProfile = {
 *   id: "123",
 *   role: USER_ROLES.PATIENT, // литеральный тип "patient"
 *   fullName: "Иван Иванов",
 *   email: "ivan@example.com",
 *   birthDate: "1990-01-01",
 *   gender: "male",
 *   // ... остальные поля из Profile
 * }
 *
 * // Проверка типа
 * if (profile && profile.role === USER_ROLES.PATIENT) {
 *   // profile имеет тип PatientProfile
 *   console.log(profile.birthDate) // ✅ Доступно
 * }
 * ```
 */
export interface PatientProfile extends Profile {
  /** Роль пациента (литеральный тип для Discriminated Union) */
  readonly role: typeof USER_ROLES.PATIENT
  /** Дата рождения (ISO строка формата YYYY-MM-DD) */
  birthDate: string | null
  /** Пол пациента */
  gender: Gender
}

/**
 * Профиль врача.
 *
 * Расширяет базовый `Profile` специфичными для врача полями,
 * включая информацию о лицензии, специализации, опыте работы и документах.
 *
 * @example
 * ```typescript
 * const doctor: DoctorProfile = {
 *   id: "456",
 *   role: USER_ROLES.DOCTOR, // литеральный тип "doctor"
 *   fullName: "Доктор Смирнов",
 *   email: "doctor@example.com",
 *   licenseNumber: "123456",
 *   specialization: "Пластическая хирургия",
 *   experience: 10,
 *   education: "МГМУ",
 *   workplace: "Клиника красоты",
 *   inn: "1234567890",
 *   gender: "male",
 *   birthDate: "1985-05-15",
 *   documents: { license: "path/to/license.pdf" },
 *   // ... остальные поля из Profile
 * }
 *
 * // Проверка типа
 * if (profile && profile.role === USER_ROLES.DOCTOR) {
 *   // profile имеет тип DoctorProfile
 *   console.log(profile.licenseNumber) // ✅ Доступно
 *   console.log(profile.specialization) // ✅ Доступно
 * }
 * ```
 */
export interface DoctorProfile extends Profile {
  /** Роль врача (литеральный тип для Discriminated Union) */
  readonly role: typeof USER_ROLES.DOCTOR
  /** Пол врача */
  gender: Gender
  /** Дата рождения (ISO строка формата YYYY-MM-DD) */
  birthDate: string | null
  /** Номер медицинской лицензии */
  licenseNumber: string
  /** Специализация врача */
  specialization: string
  /** Опыт работы (в годах) */
  experience: number
  /** Образование */
  education: string
  /** Место работы */
  workplace: string
  /** ИНН врача */
  inn: string
  /**
   * Документы врача (лицензии, сертификаты и т.д.)
   * Ключ - название документа, значение - путь к файлу или массив путей
   */
  documents: Record<string, string | string[]> | null
}

/**
 * Профиль клиники.
 *
 * Расширяет базовый `Profile` специфичными для клиники полями,
 * включая юридическую информацию, адреса, лицензии и документы.
 *
 * @example
 * ```typescript
 * const clinic: ClinicProfile = {
 *   id: "789",
 *   role: USER_ROLES.CLINIC, // литеральный тип "clinic"
 *   fullName: "Клиника красоты",
 *   email: "clinic@example.com",
 *   legalName: "ООО Клиника красоты",
 *   clinicInn: "1234567890",
 *   ogrn: "1234567890123",
 *   legalAddress: "г. Москва, ул. Ленина, д. 1",
 *   actualAddress: "г. Москва, ул. Ленина, д. 1",
 *   clinicLicense: "LIC-123456",
 *   directorName: "Иванов Иван Иванович",
 *   directorPosition: "Директор",
 *   documents: { license: "path/to/license.pdf" },
 *   // ... остальные поля из Profile
 * }
 *
 * // Проверка типа
 * if (profile && profile.role === USER_ROLES.CLINIC) {
 *   // profile имеет тип ClinicProfile
 *   console.log(profile.legalName) // ✅ Доступно
 *   console.log(profile.ogrn) // ✅ Доступно
 * }
 * ```
 */
export interface ClinicProfile extends Profile {
  /** Роль клиники (литеральный тип для Discriminated Union) */
  readonly role: typeof USER_ROLES.CLINIC
  /** Юридическое название клиники */
  legalName: string
  /** ИНН клиники */
  clinicInn: string
  /** ОГРН клиники */
  ogrn: string
  /** Юридический адрес */
  legalAddress: string
  /** Фактический адрес */
  actualAddress: string
  /** Номер лицензии клиники */
  clinicLicense: string
  /** ФИО директора */
  directorName: string
  /** Должность директора */
  directorPosition: string
  /**
   * Документы клиники (лицензии, регистрационные документы и т.д.)
   * Ключ - название документа, значение - путь к файлу или массив путей
   */
  documents: Record<string, string | string[]> | null
}

/**
 * Тип данных для создания нового пользователя.
 *
 * Выводится из Zod схемы `userCreateSchema`.
 * Содержит все поля, необходимые для регистрации пользователя.
 *
 * @example
 * ```typescript
 * const newUser: UserCreateFormData = {
 *   role: USER_ROLES.DOCTOR,
 *   email: "doctor@example.com",
 *   fullName: "Доктор Смирнов",
 *   phone: "+79991234567",
 *   licenseNumber: "123456",
 *   specialization: "Пластическая хирургия",
 *   // ... остальные поля
 * }
 * ```
 */
export type UserCreateFormData = z.infer<typeof userCreateSchema>

/**
 * Тип данных для обновления существующего пользователя.
 *
 * Выводится из Zod схемы `userUpdateSchema`.
 * Все поля опциональны, так как можно обновлять только часть данных.
 *
 * @example
 * ```typescript
 * const updateData: UserUpdateFormData = {
 *   fullName: "Новое имя",
 *   phone: "+79991234567",
 *   // можно указать только нужные поля
 * }
 * ```
 */
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>

/**
 * Маппинг роли на соответствующий тип профиля.
 *
 * Используется для создания дженерик-типов, которые позволяют
 * получать конкретный тип профиля по значению роли.
 *
 * @example
 * ```typescript
 * type DoctorProfile = ProfileByRole[typeof USER_ROLES.DOCTOR]
 * // DoctorProfile будет иметь тип DoctorProfile
 * ```
 */
export type ProfileByRole = {
  [USER_ROLES.PATIENT]: PatientProfile
  [USER_ROLES.DOCTOR]: DoctorProfile
  [USER_ROLES.CLINIC]: ClinicProfile
}

/**
 * Дженерик для получения конкретного типа профиля по роли.
 *
 * Позволяет строго типизировать функции и компоненты, которые работают
 * с конкретным типом профиля. TypeScript будет гарантировать, что
 * переданный профиль соответствует указанной роли.
 *
 * @template R - Роль пользователя (typeof USER_ROLES.PATIENT | typeof USER_ROLES.DOCTOR | typeof USER_ROLES.CLINIC)
 * @returns Соответствующий тип профиля
 *
 * @example
 * ```typescript
 * // Функция принимает только DoctorProfile
 * function updateDoctorLicense(
 *   profile: TypedProfile<typeof USER_ROLES.DOCTOR>,
 *   newLicense: string
 * ) {
 *   profile.licenseNumber = newLicense
 *   console.log(profile.specialization)
 * }
 *
 * // Использование
 * const doctor: DoctorProfile = getDoctorProfile()
 * updateDoctorLicense(doctor, "ABC123")
 * ```
 */
export type TypedProfile<R extends UserRole> = ProfileByRole[R]

/**
 * Вспомогательный тип для функций, которые принимают конкретный профиль.
 *
 * Алиас для `TypedProfile<R>`. Предназначен для использования в параметрах функций,
 * где требуется строгая типизация конкретного типа профиля.
 *
 * @template R - Роль пользователя (typeof USER_ROLES.PATIENT | typeof USER_ROLES.DOCTOR | typeof USER_ROLES.CLINIC)
 * @returns Соответствующий тип профиля
 *
 * @example
 * ```typescript
 * // Функция для обновления профиля врача
 * function updateDoctorProfile(
 *   profile: ProfileOfRole<typeof USER_ROLES.DOCTOR>,
 *   updates: Partial<DoctorProfile>
 * ) {
 *   if (updates.licenseNumber) {
 *     profile.licenseNumber = updates.licenseNumber
 *   }
 *   if (updates.specialization) {
 *     profile.specialization = updates.specialization
 *   }
 * }
 *
 * // Использование с проверкой типа
 * const profile: RoleProfile | null = await loadProfile()
 *
 * if (profile && profile.role === USER_ROLES.DOCTOR) {
 *   updateDoctorProfile(profile, { licenseNumber: "NEW123" })
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Универсальная функция с дженериком
 * function updateProfile<R extends UserRole>(
 *   profile: ProfileOfRole<R>,
 *   updates: Partial<ProfileOfRole<R>>
 * ) {
 *   Object.assign(profile, updates)
 * }
 *
 * const doctor: DoctorProfile = getDoctorProfile()
 * updateProfile(doctor, { specialization: "Новая специализация" })
 *
 * const clinic: ClinicProfile = getClinicProfile()
 * updateProfile(clinic, { legalName: "Новое название" })
 * ```
 */
export type ProfileOfRole<R extends UserRole> = TypedProfile<R>
