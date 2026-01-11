import { supabase } from "@/shared/api/supabase/client"
import type {
  Profile,
  RoleProfile,
  UserUpdateFormData,
  UserCreateFormData,
  UserRole,
} from "../types/types"
import { USER_ROLES, MODERATION_STATUS } from "../model/constants"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { uploadFiles } from "@/entities/document/api/api"
import { logger } from "@/shared/lib/logger"
import type { User } from "@supabase/supabase-js"

const PROFILES = "profiles"
const PATIENT_PROFILES = "patientProfiles"
const DOCTOR_PROFILES = "doctorProfiles"
const CLINIC_PROFILES = "clinicProfiles"

export const createUser = async (
  userId: User["id"],
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
    filePaths = await uploadFiles(userId, USER_ROLES.CLINIC, uploadedFiles[USER_ROLES.CLINIC]!)
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
      clinic: data.clinic || null,
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
      doctors: data.doctors || [],
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

export const getUser = async (userId: User["id"]): Promise<RoleProfile | null> => {
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

export const getUserById = async (userId: User["id"]): Promise<RoleProfile | null> => {
  logger.debug("Получение профиля пользователя", { userId })

  // 1) Получаем базовый профиль
  const { data: profile, error: profileError } = await supabase
    .from(PROFILES)
    .select("id, role, fullName, email, phone, moderationStatus, createdAt, updatedAt")
    .eq("id", userId)
    .eq("moderationStatus", MODERATION_STATUS.APPROVED)
    .single<RoleProfile>()

  if (profileError) {
    logger.error(
      "Ошибка получения базового профиля определённого пользователя",
      new Error(profileError.message),
      {
        userId,
        errorCode: profileError.code,
      },
    )
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
      .single()

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

export const updateUser = async (id: User["id"], data: UserUpdateFormData) => {
  if (!data) {
    logger.warn("Попытка обновить профиль без данных", { userId: id })
    return
  }

  logger.info("Начало обновления профиля", {
    userId: id,
    role: data.role,
  })

  // 1) Обновляем базовый профиль
  const baseUpdate: Partial<Profile<UserRole>> = {
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
          clinic: doctor.clinic ?? null,
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
          doctors: clinic.doctors || [],
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

/**
 * Добавление врача или клиники в избранное
 *
 * @param userId - ID пользователя-пациента
 * @param favoriteId - ID врача или клиники для добавления в избранное
 * @param type - Тип: "doctor" или "clinic"
 * @returns Promise с обновленным массивом ID избранных
 */
export const addFavorite = async (
  userId: User["id"],
  favoriteId: RoleProfile["id"],
  type: UserRole,
): Promise<string[]> => {
  try {
    // Получаем оба поля, чтобы избежать проблем с типизацией
    const { data: currentData, error: fetchError } = await supabase
      .from(PATIENT_PROFILES)
      .select("favoriteDoctors, favoriteClinics")
      .eq("id", userId)
      .single()

    if (fetchError) {
      logger.error("Ошибка получения текущего избранного", new Error(fetchError.message), {
        userId,
      })
      throw new Error(`Ошибка получения избранного: ${fetchError.message}`)
    }

    const currentFavorites =
      type === "doctor"
        ? (currentData?.favoriteDoctors as string[]) || []
        : (currentData?.favoriteClinics as string[]) || []

    // Проверяем, не добавлен ли уже
    if (currentFavorites.includes(favoriteId)) {
      return currentFavorites
    }

    // Добавляем новый ID
    const updatedFavorites = [...currentFavorites, favoriteId]

    // Обновляем в базе данных
    const updateData =
      type === "doctor"
        ? { favoriteDoctors: updatedFavorites }
        : { favoriteClinics: updatedFavorites }

    const { data, error } = await supabase
      .from(PATIENT_PROFILES)
      .update(updateData)
      .eq("id", userId)
      .select("favoriteDoctors, favoriteClinics")
      .single()

    if (error) {
      logger.error(`Ошибка добавления ${type} в избранное`, new Error(error.message), {
        userId,
        favoriteId,
      })
      throw new Error(`Ошибка добавления в избранное: ${error.message}`)
    }

    logger.info(`${type === "doctor" ? "Врач" : "Клиника"} добавлен в избранное`, {
      userId,
      favoriteId,
    })

    return type === "doctor"
      ? (data?.favoriteDoctors as string[]) || []
      : (data?.favoriteClinics as string[]) || []
  } catch (error) {
    logger.error(
      `Критическая ошибка при добавлении ${type} в избранное`,
      error instanceof Error ? error : new Error(String(error)),
      {
        userId,
        favoriteId,
      },
    )
    throw error
  }
}

/**
 * Удаление врача или клиники из избранного
 *
 * @param userId - ID пользователя-пациента
 * @param favoriteId - ID врача или клиники для удаления из избранного
 * @param type - Тип: "doctor" или "clinic"
 * @returns Promise с обновленным массивом ID избранных
 */
export const removeFavorite = async (
  userId: User["id"],
  favoriteId: RoleProfile["id"],
  type: UserRole,
): Promise<string[]> => {
  try {
    // Получаем оба поля, чтобы избежать проблем с типизацией
    const { data: currentData, error: fetchError } = await supabase
      .from(PATIENT_PROFILES)
      .select("favoriteDoctors, favoriteClinics")
      .eq("id", userId)
      .single()

    if (fetchError) {
      logger.error("Ошибка получения текущего избранного", new Error(fetchError.message), {
        userId,
      })
      throw new Error(`Ошибка получения избранного: ${fetchError.message}`)
    }

    const currentFavorites =
      type === "doctor"
        ? (currentData?.favoriteDoctors as string[]) || []
        : (currentData?.favoriteClinics as string[]) || []

    // Удаляем ID из массива
    const updatedFavorites = currentFavorites.filter((id) => id !== favoriteId)

    // Обновляем в базе данных
    const updateData =
      type === "doctor"
        ? { favoriteDoctors: updatedFavorites }
        : { favoriteClinics: updatedFavorites }

    const { data, error } = await supabase
      .from(PATIENT_PROFILES)
      .update(updateData)
      .eq("id", userId)
      .select("favoriteDoctors, favoriteClinics")
      .single()

    if (error) {
      logger.error(`Ошибка удаления ${type} из избранного`, new Error(error.message), {
        userId,
        favoriteId,
      })
      throw new Error(`Ошибка удаления из избранного: ${error.message}`)
    }

    logger.info(`${type === "doctor" ? "Врач" : "Клиника"} удален из избранного`, {
      userId,
      favoriteId,
    })

    return type === "doctor"
      ? (data?.favoriteDoctors as string[]) || []
      : (data?.favoriteClinics as string[]) || []
  } catch (error) {
    logger.error(
      `Критическая ошибка при удалении ${type} из избранного`,
      error instanceof Error ? error : new Error(String(error)),
      {
        userId,
        favoriteId,
      },
    )
    throw error
  }
}
