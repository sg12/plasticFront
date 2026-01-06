import type { SignUpFormData } from "@/features/auth/ui/signUp/model/types"
import { supabase } from "@/shared/api/supabase/client"
import type {
  Profile,
  DoctorProfile,
  ClinicProfile,
  PatientProfile,
  RoleProfile,
} from "../types/types"
import { USER_ROLES } from "../model/constants"
import type { UploadedFilesByRole } from "@/entities/document/types/types"
import { uploadFiles } from "@/entities/document/api/api"

const PROFILES = "profiles"
const PATIENT_PROFILES = "patient_profiles"
const DOCTOR_PROFILES = "doctor_profiles"
const CLINIC_PROFILES = "clinic_profiles"

export const createUser = async (
  userId: string,
  data: SignUpFormData,
  uploadedFiles: UploadedFilesByRole = {},
) => {
  // 1) Создаём базовый профиль
  const { error } = await supabase.from(PROFILES).insert({
    id: userId,
    role: data.role,
    full_name: data.basic.fullName,
    phone: data.basic.phone,
    email: data.basic.email,
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
      birth_date: data.patient?.birthDate || null,
      gender: data.patient?.gender || null,
    })
    roleError = error
  } else if (data.role === USER_ROLES.DOCTOR && data.doctor) {
    const { error } = await supabase.from(DOCTOR_PROFILES).insert({
      id: userId,
      license_number: data.doctor.licenseNumber,
      specialization: data.doctor.specialization,
      experience: data.doctor.experience,
      education: data.doctor.education,
      workplace: data.doctor.workplace,
      inn: data.doctor.inn,
      documents: filePaths,
    })
    roleError = error
  } else if (data.role === USER_ROLES.CLINIC && data.clinic) {
    const { error } = await supabase.from(CLINIC_PROFILES).insert({
      id: userId,
      legal_name: data.clinic.legalName,
      clinic_inn: data.clinic.clinicInn,
      ogrn: data.clinic.ogrn,
      legal_address: data.clinic.legalAddress,
      actual_address: data.clinic.actualAddress,
      clinic_license: data.clinic.clinicLicense,
      director_name: data.clinic.directorName,
      director_position: data.clinic.directorPosition,
      documents: filePaths,
    })
    roleError = error
  }

  if (roleError) {
    await supabase.from(PROFILES).delete().eq("id", userId)
    throw new Error(`Role profile error: ${roleError.message}`)
  }
}

export const getUser = async (userId: string): Promise<Profile | RoleProfile | null> => {
  // 1) Получаем базовый профиль
  const { data: profile, error: profileError } = await supabase
    .from(PROFILES)
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>()

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

export const updateUser = async (
  id: Profile["id"],
  data: PatientProfile | DoctorProfile | ClinicProfile,
) => {
  // 1) Обновляем базовый профиль
  const baseUpdate: Partial<Profile> = {
    full_name: data.full_name,
    phone: data.phone,
    email: data.email,
    updated_at: new Date().toISOString(),
  }

  const { error: profileError } = await supabase.from(PROFILES).update(baseUpdate).eq("id", id)
  if (profileError) throw profileError

  // 2) Обновляем role-specific данные
  switch (data.role) {
    case USER_ROLES.PATIENT: {
      const patient = data as PatientProfile
      const { error } = await supabase
        .from(PATIENT_PROFILES)
        .update({
          birth_date: patient.birth_date ?? null,
          gender: patient.gender ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) throw error
      break
    }
    case USER_ROLES.DOCTOR: {
      const doctor = data as DoctorProfile

      const { error } = await supabase
        .from(DOCTOR_PROFILES)
        .update({
          birth_date: doctor.birth_date ?? null,
          gender: doctor.gender ?? null,
          license_number: doctor.license_number,
          specialization: doctor.specialization,
          experience: doctor.experience,
          education: doctor.education,
          workplace: doctor.workplace,
          inn: doctor.inn,
          documents: doctor.documents ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) throw error
      break
    }
    case USER_ROLES.CLINIC: {
      const clinic = data as ClinicProfile
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
          legal_name: clinic.legal_name,
          clinic_inn: clinic.clinic_inn,
          ogrn: clinic.ogrn,
          legal_address: clinic.legal_address,
          actual_address: clinic.actual_address,
          clinic_license: clinic.clinic_license,
          director_name: clinic.director_name,
          director_position: clinic.director_position,
          documents: documentsNormalized ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
      if (error) throw error
      break
    }
  }
}
