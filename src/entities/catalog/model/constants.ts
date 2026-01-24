/**
 * @fileoverview Константы для каталога
 *
 * Содержит константные значения, которые используются в каталоге:
 * - Списки специализаций
 * - Диапазоны опыта работы
 * - Варианты сортировки
 * - Значения по умолчанию
 *
 * @module features/catalog/model/constants
 */

/**
 * Популярные специализации для фильтра
 *
 * Эти значения используются в выпадающем списке фильтров.
 *
 * TODO: В будущем сделать загрузку динамически из базы данных.
 *
 * @example
 * ```typescript
 * <Select>
 *   {SPECIALIZATIONS.map(spec => (
 *     <SelectItem key={spec} value={spec}>{spec}</SelectItem>
 *   ))}
 * </Select>
 * ```
 */
export const SPECIALIZATIONS = [
  "Пластическая хирургия",
  "Косметология",
  "Дерматология",
  "Эстетическая медицина",
  "Челюстно-лицевая хирургия",
  "Офтальмология",
  "Трихология",
] as const

/**
 * Диапазоны опыта работы для фильтра
 *
 * Используется в фильтре опыта. Каждый объект содержит:
 * - label: текст для отображения в UI
 * - min: минимальное значение опыта в годах
 * - max: максимальное значение (Infinity для "более N лет")
 *
 * @example
 * ```typescript
 * const range = EXPERIENCE_RANGES[0]
 * // range = { label: "До 5 лет", min: 0, max: 5 }
 *
 * // Фильтрация врачей
 * const filtered = doctors.filter(doctor =>
 *   doctor.experience >= range.min && doctor.experience < range.max
 * )
 * ```
 */
export const EXPERIENCE_RANGES = [
  { label: "До 5 лет", min: 0, max: 5 },
  { label: "5-10 лет", min: 5, max: 10 },
  { label: "10-15 лет", min: 10, max: 15 },
  { label: "15-20 лет", min: 15, max: 20 },
  { label: "Более 20 лет", min: 20, max: Infinity },
] as const

/**
 * Варианты сортировки для врачей
 *
 * Ключ - значение для API, значение - текст для UI.
 *
 * @example
 * ```typescript
 * <Select value={sortBy} onChange={setSortBy}>
 *   {Object.entries(SORT_OPTIONS).map(([key, value]) => (
 *     <SelectItem key={key} value={key}>{value}</SelectItem>
 *   ))}
 * </Select>
 * ```
 */
export const SORT_OPTIONS = {
  /** Сортировка по рейтингу (от высокого к низкому) */
  RATING: "rating",
  /** Сортировка по опыту работы (от большего к меньшему) */
  EXPERIENCE: "experience",
  /** Сортировка по имени (алфавитно) */
  NAME: "name",
} as const

/**
 * Значения по умолчанию для поиска врачей
 *
 * Эти значения применяются, когда пользователь не указал параметры.
 */
export const DEFAULT_DOCTOR_SEARCH_PARAMS = {
  page: 1,
  limit: 20,
  sortBy: "rating" as const,
  sortOrder: "desc" as const,
} as const

/**
 * Значения по умолчанию для поиска клиник
 */
export const DEFAULT_CLINIC_SEARCH_PARAMS = {
  page: 1,
  limit: 20,
  sortBy: "rating" as const,
  sortOrder: "desc" as const,
} as const

/**
 * Ключи для localStorage
 *
 * Используются для хранения избранного и других пользовательских данных.
 */
export const STORAGE_KEYS = {
  /** Ключ для хранения избранных врачей */
  FAVORITE_DOCTORS: "catalog_favorite_doctors",
  /** Ключ для хранения избранных клиник */
  FAVORITE_CLINICS: "catalog_favorite_clinics",
} as const
