import { supabase } from "@/shared/api/supabase/client"
import type { Profile, RoleProfile, UserUpdateFormData, UserCreateFormData } from "../types/types"
import { USER_ROLES, MODERATION_STATUS } from "../model/constants"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { uploadFiles } from "@/entities/document/api/api"
import { logger } from "@/shared/lib/logger"

const PROFILES = "profiles"
const PATIENT_PROFILES = "patientProfiles"
const DOCTOR_PROFILES = "doctorProfiles"
const CLINIC_PROFILES = "clinicProfiles"

export const createUser = async (
  userId: string,
  data: UserCreateFormData,
  uploadedFiles: UploadedFilesByRole = {},
) => {
  logger.info("Начало создания пользователя", {
    userId,
    role: data.role,
    email: data.email,
  })

  // 1) Создаём базовый профиль
  const { error } = await supabase.from(PROFILES).insert({
    id: userId,
    role: data.role,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    moderationStatus:
      data.role === USER_ROLES.PATIENT ? MODERATION_STATUS.APPROVED : MODERATION_STATUS.PENDING,
  })

  if (error) {
    if (
      error.code === "23505" ||
      error.message?.includes("duplicate key value violates unique constraint")
    ) {
      logger.warn("Попытка создать пользователя с существующим ID", {
        userId,
        errorCode: error.code,
      })
      const duplicateError = new Error("USER_ALREADY_EXISTS")
      duplicateError.name = "DuplicateKeyError"
      throw duplicateError
    }
    logger.error("Ошибка создания базового профиля", new Error(error.message), {
      userId,
      errorCode: error.code,
    })
    throw new Error(`Не удалось создать профиль: ${error.message}`)
  }

  // 2) Загружаем файлы в Storage (если есть) и получаем пути
  let filePaths: Record<string, string | string[]> | null = null

  if (data.role === USER_ROLES.DOCTOR && uploadedFiles[USER_ROLES.DOCTOR]) {
    logger.debug("Загрузка файлов для врача", {
      userId,
      fileCount: Object.keys(uploadedFiles[USER_ROLES.DOCTOR]!).length,
    })
    filePaths = await uploadFiles(userId, "doctor", uploadedFiles[USER_ROLES.DOCTOR]!)
  } else if (data.role === USER_ROLES.CLINIC && uploadedFiles[USER_ROLES.CLINIC]) {
    logger.debug("Загрузка файлов для клиники", {
      userId,
      fileCount: Object.keys(uploadedFiles[USER_ROLES.CLINIC]!).length,
    })
    filePaths = await uploadFiles(userId, "clinic", uploadedFiles[USER_ROLES.CLINIC]!)
  }

  // 3) Создаём role-specific данные
  let roleError = null

  if (data.role === USER_ROLES.PATIENT) {
    const { error } = await supabase.from(PATIENT_PROFILES).insert({
      id: userId,
      birthDate: data.birthDate || null,
      gender: data.gender || null,
    })
    roleError = error
  } else if (data.role === USER_ROLES.DOCTOR) {
    const { error } = await supabase.from(DOCTOR_PROFILES).insert({
      id: userId,
      licenseNumber: data.licenseNumber,
      specialization: data.specialization,
      experience: data.experience,
      education: data.education,
      workplace: data.workplace || null,
      inn: data.inn,
      birthDate: data.birthDate || null,
      gender: data.gender || null,
      documents: filePaths,
    })
    roleError = error
  } else if (data.role === USER_ROLES.CLINIC) {
    const { error } = await supabase.from(CLINIC_PROFILES).insert({
      id: userId,
      legalName: data.legalName,
      clinicInn: data.clinicInn,
      ogrn: data.ogrn,
      legalAddress: data.legalAddress,
      actualAddress: data.actualAddress,
      clinicLicense: data.clinicLicense,
      directorName: data.directorName,
      directorPosition: data.directorPosition,
      documents: filePaths,
    })
    roleError = error
  }

  if (roleError) {
    logger.error("Ошибка создания role-specific профиля", new Error(roleError.message), {
      userId,
      role: data.role,
    })
    await supabase.from(PROFILES).delete().eq("id", userId)
    logger.info("Базовый профиль удален из-за ошибки", { userId })
    throw new Error(`Role profile error: ${roleError.message}`)
  }

  logger.info("Пользователь успешно создан", {
    userId,
    role: data.role,
  })
}

export const getUser = async (userId: string): Promise<RoleProfile | null> => {
  logger.debug("Получение профиля пользователя", { userId })

  // 1) Получаем базовый профиль
  const { data: profile, error: profileError } = await supabase
    .from(PROFILES)
    .select("*")
    .eq("id", userId)
    .maybeSingle<RoleProfile>()

  if (profileError) {
    logger.error("Ошибка получения базового профиля", new Error(profileError.message), {
      userId,
      errorCode: profileError.code,
    })
    throw profileError
  }
  if (!profile) {
    logger.warn("Профиль не найден", { userId })
    return null
  }

  if (!profile.role) return profile

  let specificTable = ""
  if (profile.role === USER_ROLES.PATIENT) specificTable = PATIENT_PROFILES
  else if (profile.role === USER_ROLES.DOCTOR) specificTable = DOCTOR_PROFILES
  else if (profile.role === USER_ROLES.CLINIC) specificTable = CLINIC_PROFILES

  // 2) Получаем role-specific данные
  if (specificTable) {
    const { data: specificData, error: specificError } = await supabase
      .from(specificTable)
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (specificError) {
      logger.error("Ошибка получения role-specific данных", new Error(specificError.message), {
        userId,
        role: profile.role,
        table: specificTable,
      })
      throw specificError
    }

    const fullProfile = specificData ? { ...profile, ...specificData } : profile
    logger.debug("Профиль успешно получен", {
      userId,
      role: fullProfile.role,
    })
    return fullProfile
  }

  logger.debug("Профиль получен без role-specific данных", {
    userId,
    role: profile.role,
  })
  return profile
}

export const updateUser = async (id: Profile["id"], data: UserUpdateFormData) => {
  if (!data) {
    logger.warn("Попытка обновить профиль без данных", { userId: id })
    return
  }

  logger.info("Начало обновления профиля", {
    userId: id,
    role: data.role,
  })

  // 1) Обновляем базовый профиль
  const baseUpdate: Partial<Profile> = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    aiTokensUsed: data.aiTokenUsed,
    updatedAt: new Date().toISOString(),
  }

  const { error: profileError } = await supabase.from(PROFILES).update(baseUpdate).eq("id", id)
  if (profileError) {
    logger.error("Ошибка обновления базового профиля", new Error(profileError.message), {
      userId: id,
      errorCode: profileError.code,
    })
    throw profileError
  }

  // 2) Обновляем role-specific данные
  switch (data.role) {
    case USER_ROLES.PATIENT: {
      const patient = data
      const { error } = await supabase
        .from(PATIENT_PROFILES)
        .update({
          birthDate: patient.birthDate ?? null,
          gender: patient.gender ?? null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) {
        logger.error("Ошибка обновления профиля пациента", new Error(error.message), {
          userId: id,
        })
        throw error
      }
      logger.info("Профиль пациента успешно обновлен", { userId: id })
      break
    }
    case USER_ROLES.DOCTOR: {
      const doctor = data

      const { error } = await supabase
        .from(DOCTOR_PROFILES)
        .update({
          birthDate: doctor.birthDate ?? null,
          gender: doctor.gender ?? null,
          licenseNumber: doctor.licenseNumber,
          specialization: doctor.specialization,
          experience: doctor.experience,
          education: doctor.education,
          workplace: doctor.workplace,
          inn: doctor.inn,
          documents: doctor.documents ?? null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) {
        logger.error("Ошибка обновления профиля врача", new Error(error.message), {
          userId: id,
        })
        throw error
      }
      logger.info("Профиль врача успешно обновлен", { userId: id })
      break
    }
    case USER_ROLES.CLINIC: {
      const clinic = data
      const clinicDocs = clinic.documents
      const documentsNormalized = clinic.documents
        ? {
            ...clinic.documents,
            clinicDocuments: Array.isArray(clinicDocs)
              ? clinicDocs
              : clinicDocs
                ? [clinicDocs]
                : [],
          }
        : null
      const { error } = await supabase
        .from(CLINIC_PROFILES)
        .update({
          legalName: clinic.legalName,
          clinicInn: clinic.clinicInn,
          ogrn: clinic.ogrn,
          legalAddress: clinic.legalAddress,
          actualAddress: clinic.actualAddress,
          clinicLicense: clinic.clinicLicense,
          directorName: clinic.directorName,
          directorPosition: clinic.directorPosition,
          documents: documentsNormalized ?? null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) {
        logger.error("Ошибка обновления профиля клиники", new Error(error.message), {
          userId: id,
        })
        throw error
      }
      logger.info("Профиль клиники успешно обновлен", { userId: id })
      break
    }
  }

  logger.info("Профиль успешно обновлен", {
    userId: id,
    role: data.role,
  })
}
