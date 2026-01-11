/**
 * @fileoverview API методы для работы с каталогом врачей и клиник
 *
 * Этот файл содержит все функции для получения данных из Supabase:
 * - Получение списка врачей с фильтрацией и пагинацией
 * - Получение списка клиник с фильтрацией и пагинацией
 * - Получение детальной информации о враче/клинике
 *
 * Все запросы возвращают только одобренные профили (moderationStatus === 'approved')
 *
 * @module features/catalog/api/api
 */

import { supabase } from "@/shared/api/supabase/client"
import { USER_ROLES, MODERATION_STATUS } from "@/entities/user/model/constants"
import type {
  DoctorSearchParams,
  ClinicSearchParams,
  PaginatedResult,
  CatalogDoctor,
  CatalogClinic,
} from "../types/types"
import { logger } from "@/shared/lib/logger"

// Названия таблиц в Supabase (должны совпадать с реальными названиями)
const PROFILES_TABLE = "profiles"
const DOCTOR_PROFILES_TABLE = "doctorProfiles"
const CLINIC_PROFILES_TABLE = "clinicProfiles"

/**
 * Получение списка врачей с фильтрацией и пагинацией
 *
 * Этот метод делает JOIN между таблицами profiles и doctorProfiles,
 * применяет фильтры, сортировку и пагинацию.
 *
 * @param params - Параметры поиска и фильтрации
 * @returns Promise с результатами поиска (массив врачей + информация о пагинации)
 *
 */
export const getDoctors = async (
  params: DoctorSearchParams = {},
): Promise<PaginatedResult<CatalogDoctor>> => {
  try {
    // Значения по умолчанию для параметров
    const {
      page = 1,
      limit = 20,
      specialization,
      experienceMin,
      experienceMax,
      // ratingMin, // TODO: добавить фильтрацию по рейтингу после реализации рейтингов
      searchQuery,
      sortBy = "rating",
      sortOrder = "desc",
    } = params

    let query = supabase
      .from(PROFILES_TABLE)
      .select(
        `*,${DOCTOR_PROFILES_TABLE}(*)`,
        { count: "exact" }, // count: "exact" нужен для получения общего количества записей
      )
      .eq("role", USER_ROLES.DOCTOR)
      .eq("moderationStatus", MODERATION_STATUS.APPROVED)

    if (specialization) {
      query = query.eq(`${DOCTOR_PROFILES_TABLE}.specialization`, specialization)
    }

    if (experienceMin !== undefined) {
      query = query.gte(`${DOCTOR_PROFILES_TABLE}.experience`, experienceMin)
    }

    if (experienceMax !== undefined) {
      query = query.lte(`${DOCTOR_PROFILES_TABLE}.experience`, experienceMax)
    }

    // Поисковый запрос (по имени)
    if (searchQuery) {
      query = query.ilike("fullName", `%${searchQuery}%`)
    }

    if (sortBy === "name") {
      query = query.order("fullName", { ascending: sortOrder === "asc" })
    } else if (sortBy === "experience") {
      query = query.order("createdAt", { ascending: sortOrder === "desc" })
    } else {
      query = query.order("createdAt", { ascending: sortOrder === "desc" })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      logger.error("Ошибка получения списка врачей", error)
      throw new Error(`Ошибка получения списка врачей: ${error.message}`)
    }

    const doctors: CatalogDoctor[] = (data || []).map((item) => {
      const doctorData = item[DOCTOR_PROFILES_TABLE]
      const doctorProfile = Array.isArray(doctorData) ? doctorData[0] : doctorData

      return {
        // Поля из базового профиля
        id: item.id,
        role: item.role,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        moderationStatus: item.moderationStatus,
        moderationComment: item.moderationComment,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        moderatedAt: item.moderatedAt,
        aiTokensUsed: item.aiTokensUsed,
        // Поля из doctorProfiles
        ...(doctorProfile || {}),
        averageRating: undefined, // TODO: добавить подсчет рейтинга
        reviewCount: undefined, // TODO: добавить подсчет отзывов
      } as CatalogDoctor
    })

    const totalPages = count ? Math.ceil(count / limit) : 1

    return {
      data: doctors,
      total: count || 0,
      page,
      limit,
      totalPages,
    }
  } catch (error) {
    logger.error(
      "Критическая ошибка при получении врачей",
      error instanceof Error ? error : new Error(String(error)),
    )
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0,
    }
  }
}

/**
 * Получение списка клиник с фильтрацией и пагинацией
 *
 * @param params - Параметры поиска и фильтрации
 * @returns Promise с результатами поиска
 */
export const getClinics = async (
  params: ClinicSearchParams = {},
): Promise<PaginatedResult<CatalogClinic>> => {
  try {
    const {
      page = 1,
      limit = 20,
      address,
      // ratingMin, // TODO: добавить фильтрацию по рейтингу после реализации рейтингов
      searchQuery,
      sortBy = "rating",
      sortOrder = "desc",
    } = params

    let query = supabase
      .from(PROFILES_TABLE)
      .select(
        `
        *,
        ${CLINIC_PROFILES_TABLE}(*)
      `,
        { count: "exact" },
      )
      .eq("role", USER_ROLES.CLINIC)
      .eq("moderationStatus", MODERATION_STATUS.APPROVED)

    if (address) {
      query = query.ilike(`${CLINIC_PROFILES_TABLE}.actualAddress`, `%${address}%`)
    }

    // Поисковый запрос (по имени)
    if (searchQuery) {
      query = query.ilike("fullName", `%${searchQuery}%`)
    }

    if (sortBy === "name") {
      query = query.order("fullName", { ascending: sortOrder === "asc" })
    } else {
      query = query.order("createdAt", { ascending: sortOrder === "desc" })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      logger.error("Ошибка получения списка клиник", error)
      throw new Error(`Ошибка получения списка клиник: ${error.message}`)
    }

    const clinics: CatalogClinic[] = (data || []).map((item) => {
      const clinicData = item[CLINIC_PROFILES_TABLE]
      const clinicProfile = Array.isArray(clinicData) ? clinicData[0] : clinicData

      return {
        id: item.id,
        role: item.role,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        moderationStatus: item.moderationStatus,
        moderationComment: item.moderationComment,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        moderatedAt: item.moderatedAt,
        aiTokensUsed: item.aiTokensUsed,
        ...(clinicProfile || {}),
        averageRating: undefined,
        reviewCount: undefined,
        doctorCount: undefined, // TODO: добавить подсчет врачей в клинике
      } as CatalogClinic
    })

    const totalPages = count ? Math.ceil(count / limit) : 1

    return {
      data: clinics,
      total: count || 0,
      page,
      limit,
      totalPages,
    }
  } catch (error) {
    logger.error(
      "Критическая ошибка при получении клиник",
      error instanceof Error ? error : new Error(String(error)),
    )
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0,
    }
  }
}
