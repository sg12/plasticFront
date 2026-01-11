/**
 * @fileoverview Типы для каталога врачей и клиник
 *
 * Этот файл определяет все TypeScript типы и интерфейсы,
 * которые используются в каталоге. Они описывают:
 * - Параметры поиска
 * - Структуру данных результатов
 * - Расширенные типы для отображения в UI
 *
 * @module features/catalog/model/types
 */

import type { DoctorProfile, ClinicProfile } from "@/entities/user/types/types"

/**
 * Параметры поиска врачей
 *
 * Используется при запросах к API для фильтрации и сортировки списка врачей.
 * Все поля опциональны, так как пользователь может искать по разным критериям.
 *
 * @example
 * ```typescript
 * const searchParams: DoctorSearchParams = {
 *   specialization: "Пластическая хирургия",
 *   experienceMin: 5,
 *   ratingMin: 4.5,
 *   searchQuery: "Иванов",
 *   page: 1,
 *   limit: 20
 * }
 * ```
 */
export interface DoctorSearchParams {
  /** Специализация врача (например, "Пластическая хирургия") */
  specialization?: string
  /** Минимальный опыт работы в годах */
  experienceMin?: number
  /** Максимальный опыт работы в годах */
  experienceMax?: number
  /** Минимальный рейтинг (от 0 до 5) */
  ratingMin?: number
  /** Поисковый запрос (поиск по имени, специализации и т.д.) */
  searchQuery?: string
  /** Номер страницы для пагинации (начинается с 1) */
  page?: number
  /** Количество элементов на странице */
  limit?: number
  /** Поле для сортировки */
  sortBy?: "rating" | "experience" | "name"
  /** Направление сортировки: возрастание или убывание */
  sortOrder?: "asc" | "desc"
}

/**
 * Параметры поиска клиник
 *
 * Аналогично DoctorSearchParams, но для поиска клиник.
 *
 * @example
 * ```typescript
 * const searchParams: ClinicSearchParams = {
 *   address: "Москва",
 *   ratingMin: 4.0,
 *   searchQuery: "Клиника красоты",
 *   page: 1,
 *   limit: 20
 * }
 * ```
 */
export interface ClinicSearchParams {
  /** Адрес клиники для поиска по местоположению */
  address?: string
  /** Минимальный рейтинг (от 0 до 5) */
  ratingMin?: number
  /** Поисковый запрос (поиск по названию, адресу и т.д.) */
  searchQuery?: string
  /** Номер страницы для пагинации (начинается с 1) */
  page?: number
  /** Количество элементов на странице */
  limit?: number
  /** Поле для сортировки */
  sortBy?: "rating" | "name"
  /** Направление сортировки */
  sortOrder?: "asc" | "desc"
}

/**
 * Результат запроса с пагинацией
 *
 * Обобщенный тип (Generic), который может использоваться
 * как для врачей, так и для клиник. Содержит массив данных,
 * информацию о пагинации и общее количество элементов.
 *
 * @template T - Тип элементов в массиве данных (DoctorProfile, ClinicProfile и т.д.)
 *
 * @example
 * ```typescript
 * // Результат поиска врачей
 * const doctorsResult: PaginatedResult<DoctorProfile> = {
 *   data: [doctor1, doctor2, doctor3],
 *   total: 50,
 *   page: 1,
 *   limit: 20,
 *   totalPages: 3
 * }
 * ```
 */
export interface PaginatedResult<T> {
  /** Массив элементов текущей страницы */
  data: T[]
  /** Общее количество элементов (во всех страницах) */
  total: number
  /** Номер текущей страницы */
  page: number
  /** Количество элементов на странице */
  limit: number
  /** Общее количество страниц */
  totalPages: number
}

/**
 * Информация о пагинации
 *
 * Упрощенный вариант, используется в store для хранения состояния пагинации.
 */
export interface PaginationInfo {
  /** Текущая страница */
  page: number
  /** Размер страницы (количество элементов) */
  limit: number
  /** Общее количество элементов */
  total: number
  /** Общее количество страниц */
  totalPages: number
}

/**
 * Расширенный тип профиля врача для каталога
 *
 * Наследует все поля из DoctorProfile и добавляет дополнительные поля,
 * которые нужны для отображения в каталоге (рейтинг, количество отзывов,
 * флаг избранного и т.д.)
 *
 * @remarks
 * Поле `isFavorite` может вычисляться на клиенте или приходить с сервера,
 * в зависимости от архитектуры. Для MVP используем локальное хранилище.
 *
 * @example
 * ```typescript
 * const catalogDoctor: CatalogDoctor = {
 *   // Все поля из DoctorProfile
 *   id: "123",
 *   fullName: "Иванов Иван Иванович",
 *   specialization: "Пластическая хирургия",
 *   experience: 10,
 *   // Дополнительные поля для каталога
 *   averageRating: 4.8,
 *   reviewCount: 42,
 *   isFavorite: true
 * }
 * ```
 */
export interface CatalogDoctor extends DoctorProfile {
  /** Средний рейтинг врача (от 0 до 5) */
  averageRating?: number
  /** Количество отзывов */
  reviewCount?: number
  /** Флаг, находится ли врач в избранном у текущего пользователя */
  isFavorite?: boolean
  /** Информация о клинике (заполняется при запросах для удобства) */
  clinicInfo?: {
    id: string
    legalName: string
    actualAddress: string | null
  }
}

/**
 * Расширенный тип профиля клиники для каталога
 *
 * Аналогично CatalogDoctor, но для клиник.
 *
 * @example
 * ```typescript
 * const catalogClinic: CatalogClinic = {
 *   // Все поля из ClinicProfile
 *   id: "456",
 *   legalName: "Клиника красоты",
 *   actualAddress: "Москва, ул. Ленина, 1",
 *   // Дополнительные поля для каталога
 *   averageRating: 4.5,
 *   reviewCount: 128,
 *   doctorCount: 15,
 *   isFavorite: false
 * }
 * ```
 */
export interface CatalogClinic extends ClinicProfile {
  /** Средний рейтинг клиники (от 0 до 5) */
  averageRating?: number
  /** Количество отзывов */
  reviewCount?: number
  /** Флаг, находится ли клиника в избранном у текущего пользователя */
  isFavorite?: boolean
  /** Количество врачей в клинике */
  doctorCount?: number
}

/**
 * Тип вкладки в каталоге
 *
 * Используется для переключения между списками врачей и клиник.
 */
export type CatalogTab = "doctors" | "clinics" | "favorites"
