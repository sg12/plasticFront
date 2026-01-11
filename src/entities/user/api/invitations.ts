/**
 * @fileoverview API методы для работы с приглашениями врачей в клиники
 *
 * Этот модуль содержит функции для управления связями между врачами и клиниками:
 * - Отправка приглашений от клиники к врачу
 * - Принятие/отклонение приглашений
 * - Получение списка клиник врача
 * - Получение списка врачей клиники
 *
 * @module entities/user/api/clinicMemberships
 */

import type { ClinicMembership, ClinicMembershipStatus } from '@/entities/user/types/invitations'
import { supabase } from "@/shared/api/supabase/client"
import { logger } from "@/shared/lib/logger"

const CLINIC_MEMBERSHIPS_TABLE = "doctorClinicMemberships"
const CLINIC_PROFILES_TABLE = "clinicProfiles"

/**
 * Отправка приглашения врачу от клиники
 *
 * @param clinicId - ID клиники (отправитель)
 * @param doctorId - ID врача (получатель)
 * @returns Promise с созданной записью о приглашении
 */
export const inviteDoctorToClinic = async (
  clinicId: string,
  doctorId: string,
): Promise<ClinicMembership> => {
  try {
    logger.info("Отправка приглашения врачу в клинику", { clinicId, doctorId })

    // Проверяем, не существует ли уже приглашение
    const { data: existing } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select("*")
      .eq("clinicId", clinicId)
      .eq("doctorId", doctorId)
      .maybeSingle()

    if (existing) {
      if (existing.status === "accepted") {
        throw new Error("Врач уже является сотрудником этой клиники")
      }
      if (existing.status === "pending") {
        throw new Error("Приглашение уже отправлено")
      }
      // Если статус rejected или left, обновляем на pending
      const { data, error } = await supabase
        .from(CLINIC_MEMBERSHIPS_TABLE)
        .update({
          status: "pending",
          invitedAt: new Date().toISOString(),
          acceptedAt: null,
        })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) throw error
      return data as ClinicMembership
    }

    // Создаем новое приглашение
    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .insert({
        clinicId,
        doctorId,
        status: "pending",
        invitedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      logger.error("Ошибка отправки приглашения", new Error(error.message), {
        clinicId,
        doctorId,
      })
      throw new Error(`Не удалось отправить приглашение: ${error.message}`)
    }

    logger.info("Приглашение успешно отправлено", { clinicId, doctorId })
    return data as ClinicMembership
  } catch (error) {
    logger.error(
      "Критическая ошибка при отправке приглашения",
      error instanceof Error ? error : new Error(String(error)),
      { clinicId, doctorId },
    )
    throw error
  }
}

/**
 * Принятие приглашения врачом
 *
 * @param doctorId - ID врача
 * @param membershipId - ID записи о приглашении
 * @returns Promise с обновленной записью
 */
export const acceptInvitation = async (
  doctorId: string,
  membershipId: string,
): Promise<ClinicMembership> => {
  try {
    logger.info("Принятие приглашения врачом", { doctorId, membershipId })

    // Проверяем, что приглашение существует и принадлежит врачу
    const { data: membership, error: fetchError } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select("*")
      .eq("id", membershipId)
      .eq("doctorId", doctorId)
      .maybeSingle()

    if (fetchError) {
      throw new Error(`Ошибка получения приглашения: ${fetchError.message}`)
    }

    if (!membership) {
      throw new Error("Приглашение не найдено")
    }

    if (membership.status !== "pending") {
      throw new Error(
        `Приглашение уже ${membership.status === "accepted" ? "принято" : "отклонено"}`,
      )
    }

    // Обновляем статус на accepted
    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .update({
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      })
      .eq("id", membershipId)
      .select()
      .single()

    if (error) {
      logger.error("Ошибка принятия приглашения", new Error(error.message), {
        doctorId,
        membershipId,
      })
      throw new Error(`Не удалось принять приглашение: ${error.message}`)
    }

    logger.info("Приглашение успешно принято", { doctorId, membershipId })
    return data as ClinicMembership
  } catch (error) {
    logger.error(
      "Критическая ошибка при принятии приглашения",
      error instanceof Error ? error : new Error(String(error)),
      { doctorId, membershipId },
    )
    throw error
  }
}

/**
 * Отклонение приглашения врачом
 *
 * @param doctorId - ID врача
 * @param membershipId - ID записи о приглашении
 * @returns Promise с обновленной записью
 */
export const rejectInvitation = async (
  doctorId: string,
  membershipId: string,
): Promise<ClinicMembership> => {
  try {
    logger.info("Отклонение приглашения врачом", { doctorId, membershipId })

    // Проверяем, что приглашение существует и принадлежит врачу
    const { data: membership, error: fetchError } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select("*")
      .eq("id", membershipId)
      .eq("doctorId", doctorId)
      .maybeSingle()

    if (fetchError) {
      throw new Error(`Ошибка получения приглашения: ${fetchError.message}`)
    }

    if (!membership) {
      throw new Error("Приглашение не найдено")
    }

    if (membership.status !== "pending") {
      throw new Error("Приглашение уже обработано")
    }

    // Обновляем статус на rejected
    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .update({
        status: "rejected",
      })
      .eq("id", membershipId)
      .select()
      .single()

    if (error) {
      logger.error("Ошибка отклонения приглашения", new Error(error.message), {
        doctorId,
        membershipId,
      })
      throw new Error(`Не удалось отклонить приглашение: ${error.message}`)
    }

    logger.info("Приглашение успешно отклонено", { doctorId, membershipId })
    return data as ClinicMembership
  } catch (error) {
    logger.error(
      "Критическая ошибка при отклонении приглашения",
      error instanceof Error ? error : new Error(String(error)),
      { doctorId, membershipId },
    )
    throw error
  }
}

/**
 * Получение списка клиник врача (только принятые)
 *
 * @param doctorId - ID врача
 * @returns Promise с массивом принятых клиник
 */
export const getDoctorClinics = async (
  doctorId: string,
): Promise<ClinicMembership[]> => {
  try {
    logger.debug("Получение списка клиник врача", { doctorId })

    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select(
        `
        *,
        clinic:clinicId (
          id,
          fullName,
          ${CLINIC_PROFILES_TABLE} (
            legalName,
            actualAddress
          )
        )
      `,
      )
      .eq("doctorId", doctorId)
      .eq("status", "accepted")
      .order("acceptedAt", { ascending: false })

    if (error) {
      logger.error("Ошибка получения клиник врача", new Error(error.message), {
        doctorId,
      })
      throw new Error(`Не удалось получить список клиник: ${error.message}`)
    }

    // Преобразуем данные в нужный формат
    const memberships: ClinicMembership[] = (data || []).map((item: any) => {
      const clinicProfile = Array.isArray(item.clinic?.[CLINIC_PROFILES_TABLE])
        ? item.clinic[CLINIC_PROFILES_TABLE][0]
        : item.clinic?.[CLINIC_PROFILES_TABLE]

      return {
        id: item.id,
        doctorId: item.doctorId,
        clinicId: item.clinicId,
        status: item.status as ClinicMembershipStatus,
        invitedAt: item.invitedAt,
        acceptedAt: item.acceptedAt,
        createdAt: item.createdAt,
        clinic: item.clinic
          ? {
              id: item.clinic.id,
              legalName: clinicProfile?.legalName || item.clinic.fullName || "",
              actualAddress: clinicProfile?.actualAddress || null,
            }
          : undefined,
      }
    })

    logger.debug("Список клиник врача успешно получен", {
      doctorId,
      count: memberships.length,
    })
    return memberships
  } catch (error) {
    logger.error(
      "Критическая ошибка при получении клиник врача",
      error instanceof Error ? error : new Error(String(error)),
      { doctorId },
    )
    return []
  }
}

/**
 * Получение всех приглашений врача (включая pending)
 *
 * @param doctorId - ID врача
 * @returns Promise с массивом всех приглашений
 */
export const getDoctorInvitations = async (
  doctorId: string,
): Promise<ClinicMembership[]> => {
  try {
    logger.debug("Получение приглашений врача", { doctorId })

    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select(
        `
        *,
        clinic:clinicId (
          id,
          fullName,
          ${CLINIC_PROFILES_TABLE} (
            legalName,
            actualAddress
          )
        )
      `,
      )
      .eq("doctorId", doctorId)
      .order("invitedAt", { ascending: false })

    if (error) {
      logger.error("Ошибка получения приглашений", new Error(error.message), {
        doctorId,
      })
      throw new Error(`Не удалось получить приглашения: ${error.message}`)
    }

    // Преобразуем данные в нужный формат
    const memberships: ClinicMembership[] = (data || []).map((item: any) => {
      const clinicProfile = Array.isArray(item.clinic?.[CLINIC_PROFILES_TABLE])
        ? item.clinic[CLINIC_PROFILES_TABLE][0]
        : item.clinic?.[CLINIC_PROFILES_TABLE]

      return {
        id: item.id,
        doctorId: item.doctorId,
        clinicId: item.clinicId,
        status: item.status as ClinicMembershipStatus,
        invitedAt: item.invitedAt,
        acceptedAt: item.acceptedAt,
        createdAt: item.createdAt,
        clinic: item.clinic
          ? {
              id: item.clinic.id,
              legalName: clinicProfile?.legalName || item.clinic.fullName || "",
              actualAddress: clinicProfile?.actualAddress || null,
            }
          : undefined,
      }
    })

    logger.debug("Приглашения успешно получены", {
      doctorId,
      count: memberships.length,
    })
    return memberships
  } catch (error) {
    logger.error(
      "Критическая ошибка при получении приглашений",
      error instanceof Error ? error : new Error(String(error)),
      { doctorId },
    )
    return []
  }
}

/**
 * Получение списка врачей клиники
 *
 * @param clinicId - ID клиники
 * @returns Promise с массивом врачей клиники
 */
export const getClinicDoctors = async (
  clinicId: string,
): Promise<ClinicMembership[]> => {
  try {
    logger.debug("Получение списка врачей клиники", { clinicId })

    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select(
        `
        *,
        doctor:doctorId (
          id,
          fullName
        )
      `,
      )
      .eq("clinicId", clinicId)
      .eq("status", "accepted")
      .order("acceptedAt", { ascending: false })

    if (error) {
      logger.error("Ошибка получения врачей клиники", new Error(error.message), {
        clinicId,
      })
      throw new Error(`Не удалось получить список врачей: ${error.message}`)
    }

    // Преобразуем данные
    const memberships: ClinicMembership[] = (data || []).map((item: any) => ({
      id: item.id,
      doctorId: item.doctorId,
      clinicId: item.clinicId,
      status: item.status as ClinicMembershipStatus,
      invitedAt: item.invitedAt,
      acceptedAt: item.acceptedAt,
      createdAt: item.createdAt,
    }))

    logger.debug("Список врачей клиники успешно получен", {
      clinicId,
      count: memberships.length,
    })
    return memberships
  } catch (error) {
    logger.error(
      "Критическая ошибка при получении врачей клиники",
      error instanceof Error ? error : new Error(String(error)),
      { clinicId },
    )
    return []
  }
}
