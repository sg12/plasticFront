import type { SignUpFormData } from "@/features/signUp/model/types";
import { supabase } from "@/shared/api/supabase/client";
import type { Profile, User, DoctorProfile, ClinicProfile, PatientProfile } from "../types/types";
import { USER_ROLES } from "../model/constants";
import type { UploadedFilesByRole } from "@/entities/document/types/types";
import { uploadFiles } from "@/entities/document/api/api";

const PROFILES = "profiles";
const PATIENT_PROFILES = "patient_profiles";
const DOCTOR_PROFILES = "doctor_profiles";
const CLINIC_PROFILES = "clinic_profiles";

export const createUser = async (
  userId: string,
  data: SignUpFormData,
  uploadedFiles?: UploadedFilesByRole
) => {
  // 1) Создаём базовый профиль
  const { error } = await supabase.from(PROFILES).insert({
    id: userId,
    role: data.role,
    full_name: data.basic.fullName,
    phone: data.basic.phone,
  });

  if (error) {
    console.error("Ошибка создания базового профиля:", error);
    throw new Error(`Не удалось создать профиль: ${error.message}`);
  }

  // 2) Загружаем файлы в Storage (если есть) и получаем пути
  let filePaths: Record<string, string | string[]> | null = null;
  if (
    uploadedFiles &&
    (data.role === USER_ROLES.DOCTOR || data.role === USER_ROLES.CLINIC)
  ) {
    const roleFiles = uploadedFiles[data.role];
    if (roleFiles && Object.keys(roleFiles).length > 0) {
      try {
        filePaths = await uploadFiles(userId, data.role, roleFiles as any);
      } catch (uploadError: any) {
        console.error("Ошибка загрузки файлов:", uploadError);
        throw new Error(`Не удалось загрузить файлы: ${uploadError.message}`);
      }
    }
  }

  // 3) Создаём role-specific данные
  if (data.role === USER_ROLES.PATIENT) {
    // Для пациента всегда создаём запись (данные могут быть опциональными)
    const { error: patientError } = await supabase.from(PATIENT_PROFILES).insert({
      id: userId,
      birth_date: data.patient?.birthDate || null,
      gender: data.patient?.gender || null,
    });
    if (patientError) {
      console.error("Ошибка создания профиля пациента:", patientError);
      throw new Error(`Не удалось создать профиль пациента: ${patientError.message}`);
    }
  } else if (data.role === USER_ROLES.DOCTOR) {
    if (!data.doctor) {
      throw new Error("Данные доктора обязательны для регистрации");
    }
    const { error } = await supabase.from(DOCTOR_PROFILES).insert({
      id: userId,
      license_number: data.doctor.licenseNumber,
      specialization: data.doctor.specialization,
      experience: data.doctor.experience,
      education: data.doctor.education,
      workplace: data.doctor.workplace,
      inn: data.doctor.inn,
      documents: filePaths || null, // Сохраняем пути к файлам
    });
    if (error) {
      console.error("Ошибка создания профиля доктора:", error);
      throw new Error(`Не удалось создать профиль доктора: ${error.message}`);
    }
  } else if (data.role === USER_ROLES.CLINIC) {
    if (!data.clinic) {
      throw new Error("Данные клиники обязательны для регистрации");
    }
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
      documents: filePaths || null, // Сохраняем пути к файлам
    });
    if (error) {
      console.error("Ошибка создания профиля клиники:", error);
      throw new Error(`Не удалось создать профиль клиники: ${error.message}`);
    }
  }
};

export const getUser = async (userId: string): Promise<Profile | DoctorProfile | ClinicProfile | PatientProfile> => {
  // 1) Получаем базовый профиль
  const { data: profile, error: profileError } = await supabase
    .from(PROFILES)
    .select("id, role, full_name, phone, moderation_status, moderation_comment, moderated_at, created_at, updated_at")
    .eq("id", userId)
    .single<Profile>();

  if (profileError) throw profileError;
  if (!profile) throw new Error("Profile not found");

  // 2) Получаем role-specific данные
  if (profile.role === USER_ROLES.PATIENT) {
    const { data: patientData, error: patientError } = await supabase
      .from(PATIENT_PROFILES)
      .select("birth_date, gender")
      .eq("id", userId)
      .single();

    if (patientError) throw patientError;
    return { ...profile, ...patientData } as PatientProfile;
  }

  if (profile.role === USER_ROLES.DOCTOR) {
    const { data: doctorData, error: doctorError } = await supabase
      .from(DOCTOR_PROFILES)
      .select("license_number, specialization, experience, education, workplace, inn, documents")
      .eq("id", userId)
      .single();

    if (doctorError) throw doctorError;
    return { ...profile, ...doctorData } as DoctorProfile;
  }

  if (profile.role === USER_ROLES.CLINIC) {
    const { data: clinicData, error: clinicError } = await supabase
      .from(CLINIC_PROFILES)
      .select("legal_name, clinic_inn, ogrn, legal_address, actual_address, clinic_license, director_name, director_position, documents")
      .eq("id", userId)
      .single();

    if (clinicError) throw clinicError;
    return { ...profile, ...clinicData } as ClinicProfile;
  }

  return profile;
};

export const updateUser = async (id: User["id"], data: User) => {
  // 1) Обновляем базовый профиль
  const baseUpdate: Partial<Profile> = {
    full_name: data.fullName,
    phone: data.phone,
  };

  const { error: profileError } = await supabase
    .from(PROFILES)
    .update(baseUpdate)
    .eq("id", id);

  if (profileError) throw profileError;

  // 2) Обновляем role-specific данные
  if (data.role === USER_ROLES.PATIENT && "info" in data) {
    const { error } = await supabase
      .from(PATIENT_PROFILES)
      .update({
        birth_date: data.info.birthDate || null,
        gender: data.info.gender || null,
      })
      .eq("id", id);
    if (error) throw error;
  } else if (data.role === USER_ROLES.DOCTOR && "info" in data) {
    const { error } = await supabase
      .from(DOCTOR_PROFILES)
      .update({
        license_number: data.info.licenseNumber,
        specialization: data.info.specialization,
        experience: data.info.experience,
        education: data.info.education,
        workplace: data.info.workplace,
        inn: data.info.inn,
      })
      .eq("id", id);
    if (error) throw error;
  } else if (data.role === USER_ROLES.CLINIC && "info" in data) {
    const { error } = await supabase
      .from(CLINIC_PROFILES)
      .update({
        legal_name: data.info.legalName,
        clinic_inn: data.info.clinicInn,
        ogrn: data.info.ogrn,
        legal_address: data.info.legalAddress,
        actual_address: data.info.actualAddress,
        clinic_license: data.info.clinicLicense,
        director_name: data.info.directorName,
        director_position: data.info.directorPosition,
      })
      .eq("id", id);
    if (error) throw error;
  }
};

export const deleteUser = async () => {
  throw new Error("deleteUser must be called from server");
};
