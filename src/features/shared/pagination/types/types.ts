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
