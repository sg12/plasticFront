import type { USER_ROLES } from "@/entities/user/model/user.constants"

/**
 * Тип для загруженных файлов по ролям.
 * Ключи - роли пользователей (doctor, clinic)
 * Значения - объекты с файлами, где ключи - имена полей, значения - File или File[]
 */
export type UploadedFilesByRole = {
  [USER_ROLES.PATIENT]?: Record<string, File | File[]>
  [USER_ROLES.DOCTOR]?: Record<string, File | File[]>
  [USER_ROLES.CLINIC]?: Record<string, File | File[]>
}
