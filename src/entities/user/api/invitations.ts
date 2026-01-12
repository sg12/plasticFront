/**
 * @fileoverview API методы для работы с приглашениями врачей в клиники
 *
 * Этот модуль содержит функции для управления связями между врачами и клиниками:
 * - Отправка приглашений от клиники к врачу
 * - Принятие/отклонение приглашений
 * - Получение списка клиник врача
 * - Получение списка врачей клиники
 *
 * @module entities/user/api/invitations
 */

import type { ClinicMembership, ClinicMembershipStatus } from "@/entities/user/types/invitations"
import { supabase } from "@/shared/api/supabase/client"
import { logger } from "@/shared/lib/logger"

const CLINIC_MEMBERSHIPS_TABLE = "clinicMemberships"
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

    // Проверяем все существующие записи о связи врача с клиникой
    const { data: existingRecords, error: fetchError } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select("*")
      .eq("clinicId", clinicId)
      .eq("doctorId", doctorId)
      .order("createdAt", { ascending: false })

    if (fetchError) {
      logger.error("Ошибка проверки существующих приглашений", new Error(fetchError.message), {
        clinicId,
        doctorId,
      })
      throw new Error(`Не удалось проверить существующие приглашения: ${fetchError.message}`)
    }

    // Проверяем, есть ли активное приглашение или членство
    const activeMembership = existingRecords?.find(
      (record) => record.status === "accepted" || record.status === "pending",
    )

    if (activeMembership) {
      if (activeMembership.status === "accepted") {
        throw new Error("Врач уже является сотрудником этой клиники")
      }
      if (activeMembership.status === "pending") {
        throw new Error("Приглашение уже отправлено")
      }
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

    // Получаем информацию о клинике для обновления workplace
    const { data: clinicData, error: clinicError } = await supabase
      .from(CLINIC_PROFILES_TABLE)
      .select("legalName, id")
      .eq("id", membership.clinicId)
      .maybeSingle()

    if (clinicError) {
      logger.warn("Не удалось получить информацию о клинике", {
        clinicId: membership.clinicId,
        error: clinicError.message,
      })
    }

    // Получаем название клиники
    const clinicName = clinicData?.legalName || null

    // Обновляем статус на accepted
    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .update({
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      })
      .eq("id", membershipId)
      .select()
      .maybeSingle()

    if (error) {
      logger.error("Ошибка принятия приглашения", new Error(error.message), {
        doctorId,
        membershipId,
      })
      throw new Error(`Не удалось принять приглашение: ${error.message}`)
    }

    if (!data) {
      throw new Error("Не удалось принять приглашение: запись не найдена после обновления")
    }

    // Обновляем профиль врача: добавляем клинику в workplace и clinic
    if (clinicName) {
      // Получаем текущий профиль врача для проверки существующего workplace
      const { data: currentProfile, error: fetchProfileError } = await supabase
        .from("doctorProfiles")
        .select("workplace, clinic")
        .eq("id", doctorId)
        .maybeSingle()

      if (fetchProfileError) {
        logger.warn("Не удалось получить профиль врача для обновления workplace", {
          doctorId,
          error: fetchProfileError.message,
        })
      }

      const currentWorkplace = currentProfile?.workplace || ""
      let newWorkplace = clinicName

      if (currentWorkplace && !currentWorkplace.includes(clinicName)) {
        newWorkplace = `${currentWorkplace}, ${clinicName}`
      } else if (currentWorkplace && currentWorkplace.includes(clinicName)) {
        newWorkplace = currentWorkplace
      }

      // Обновляем профиль врача
      const { error: updateError } = await supabase
        .from("doctorProfiles")
        .update({
          workplace: newWorkplace,
          clinic: membership.clinicId, // Обновляем ID клиники (последняя принятая)
        })
        .eq("id", doctorId)

      if (updateError) {
        logger.warn("Не удалось обновить workplace врача", {
          doctorId,
          clinicId: membership.clinicId,
          clinicName,
          error: updateError.message,
        })
        // Не прерываем выполнение, так как приглашение уже принято
      } else {
        logger.info("Профиль врача обновлен: добавлена клиника в workplace", {
          doctorId,
          clinicId: membership.clinicId,
          clinicName,
          newWorkplace,
        })
      }
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
      .maybeSingle()

    if (error) {
      logger.error("Ошибка отклонения приглашения", new Error(error.message), {
        doctorId,
        membershipId,
      })
      throw new Error(`Не удалось отклонить приглашение: ${error.message}`)
    }

    if (!data) {
      throw new Error("Не удалось отклонить приглашение: запись не найдена после обновления")
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
export const getDoctorClinics = async (doctorId: string): Promise<ClinicMembership[]> => {
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
export const getDoctorInvitations = async (doctorId: string): Promise<ClinicMembership[]> => {
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
 * @returns Promise с массивом врачей клиники с полной информацией
 */
export const getClinicDoctors = async (clinicId: string): Promise<ClinicMembership[]> => {
  try {
    logger.debug("Получение списка врачей клиники", { clinicId })

    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select(
        `
        *,
        doctor:doctorId (
          id,
          fullName,
          email,
          phone,
          doctorProfiles (
            specialization,
            experience,
            licenseNumber
          )
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
    const memberships: ClinicMembership[] = (data || []).map((item: any) => {
      // Обрабатываем doctorProfiles - может быть массивом или объектом
      const doctorProfilesData = item.doctor?.doctorProfiles
      const doctorProfile = Array.isArray(doctorProfilesData)
        ? doctorProfilesData[0]
        : doctorProfilesData

      return {
        id: item.id,
        doctorId: item.doctorId,
        clinicId: item.clinicId,
        status: item.status as ClinicMembershipStatus,
        invitedAt: item.invitedAt,
        acceptedAt: item.acceptedAt,
        createdAt: item.createdAt,
        doctor: item.doctor
          ? {
              id: item.doctor.id,
              fullName: item.doctor.fullName || "",
              email: item.doctor.email || "",
              phone: item.doctor.phone || "",
              specialization: doctorProfile?.specialization || null,
              experience: doctorProfile?.experience ?? null,
              licenseNumber: doctorProfile?.licenseNumber || null,
            }
          : undefined,
      }
    })

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

/**
 * Удаление врача из клиники (изменение статуса на "left")
 *
 * @param clinicId - ID клиники
 * @param doctorId - ID врача
 * @returns Promise с обновленной записью
 */
export const removeDoctorFromClinic = async (
  clinicId: string,
  doctorId: string,
): Promise<ClinicMembership> => {
  try {
    logger.info("Удаление врача из клиники", { clinicId, doctorId })

    // Проверяем, что запись существует
    const { data: existing, error: fetchError } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .select("*")
      .eq("clinicId", clinicId)
      .eq("doctorId", doctorId)
      .eq("status", "accepted")
      .maybeSingle()

    if (fetchError) {
      throw new Error(`Ошибка получения записи: ${fetchError.message}`)
    }

    if (!existing) {
      throw new Error("Врач не найден в списке сотрудников клиники")
    }

    // Обновляем статус на "left"
    const { data, error } = await supabase
      .from(CLINIC_MEMBERSHIPS_TABLE)
      .update({
        status: "left",
      })
      .eq("id", existing.id)
      .select()
      .maybeSingle()

    if (error) {
      logger.error("Ошибка удаления врача из клиники", new Error(error.message), {
        clinicId,
        doctorId,
      })
      throw new Error(`Не удалось удалить врача: ${error.message}`)
    }

    if (!data) {
      throw new Error("Не удалось удалить врача: запись не найдена после обновления")
    }

    logger.info("Врач успешно удален из клиники", { clinicId, doctorId })
    return data as ClinicMembership
  } catch (error) {
    logger.error(
      "Критическая ошибка при удалении врача из клиники",
      error instanceof Error ? error : new Error(String(error)),
      { clinicId, doctorId },
    )
    throw error
  }
}
