/**
 * @fileoverview Zod схемы валидации для каталога
 *
 * Zod - библиотека для валидации данных на основе TypeScript.
 * Эти схемы используются для:
 * - Валидации параметров поиска перед отправкой на сервер
 * - Типобезопасности в формах фильтров
 * - Автоматического вывода типов
 *
 * @module features/catalog/model/schema
 */

import { z } from "zod"

/**
 * Схема валидации параметров поиска врачей
 */
export const doctorSearchSchema = z.object({
  specialization: z.string().optional(),
  experienceMin: z.number().min(0).optional(),
  experienceMax: z.number().min(0).optional(),
  ratingMin: z.number().min(0).max(5).optional(),
  searchQuery: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(["rating", "experience", "name"]).default("rating"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

/**
 * Схема валидации параметров поиска клиник
 */
export const clinicSearchSchema = z.object({
  address: z.string().optional(),
  ratingMin: z.number().min(0).max(5).optional(),
  searchQuery: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(["rating", "name"]).default("rating"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

/**
 * Автоматический вывод типов из схем Zod
 */
export type ValidatedDoctorSearchParams = z.infer<typeof doctorSearchSchema>
export type ValidatedClinicSearchParams = z.infer<typeof clinicSearchSchema>
