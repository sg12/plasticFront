import { supabase } from "@/shared/api/supabase/client"
import type { Profile, RoleProfile, UserUpdateFormData, UserCreateFormData } from "../types/types"
import { USER_ROLES, MODERATION_STATUS } from "../model/constants"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { uploadFiles } from "@/entities/document/api/api"

const PROFILES = "profiles"
const PATIENT_PROFILES = "patientProfiles"
const DOCTOR_PROFILES = "doctorProfiles"
const CLINIC_PROFILES = "clinicProfiles"

export const createUser = async (
  userId: string,
  data: UserCreateFormData,
  uploadedFiles: UploadedFilesByRole = {},
) => {
  // 1) Создаём базовый профиль
  const { error } = await supabase.from(PROFILES).insert({
    id: userId,
    role: data.role,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    moderationStatus: data.role === USER_ROLES.PATIENT ? MODERATION_STATUS.APPROVED : MODERATION_STATUS.PENDING,
  })

  if (error) {
    if (
      error.code === "23505" ||
      error.message?.includes("duplicate key value violates unique constraint")
    ) {
      const duplicateError = new Error("USER_ALREADY_EXISTS")
      duplicateError.name = "DuplicateKeyError"
      throw duplicateError
    }
    throw new Error(`Не удалось создать профиль: ${error.message}`)
  }

  // 2) Загружаем файлы в Storage (если есть) и получаем пути
  let filePaths: Record<string, string | string[]> | null = null

  if (data.role === USER_ROLES.DOCTOR && uploadedFiles[USER_ROLES.DOCTOR]) {
    filePaths = await uploadFiles(userId, "doctor", uploadedFiles[USER_ROLES.DOCTOR]!)
  } else if (data.role === USER_ROLES.CLINIC && uploadedFiles[USER_ROLES.CLINIC]) {
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
    await supabase.from(PROFILES).delete().eq("id", userId)
    throw new Error(`Role profile error: ${roleError.message}`)
  }
}

export const getUser = async (userId: string): Promise<RoleProfile | null> => {
  // 1) Получаем базовый профиль
  const { data: profile, error: profileError } = await supabase
    .from(PROFILES)
    .select("*")
    .eq("id", userId)
    .maybeSingle<RoleProfile>()

  if (profileError) throw profileError
  if (!profile) return null

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

    if (specificError) throw specificError

    return specificData ? { ...profile, ...specificData } : profile
  }

  return profile
}

export const updateUser = async (id: Profile["id"], data: UserUpdateFormData) => {
  if (!data) return
  // 1) Обновляем базовый профиль
  const baseUpdate: Partial<Profile> = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    updatedAt: new Date().toISOString(),
  }

  const { error: profileError } = await supabase.from(PROFILES).update(baseUpdate).eq("id", id)
  if (profileError) throw profileError

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
      if (error) throw error
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
      if (error) throw error
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
      if (error) throw error
      break
    }
  }
}
