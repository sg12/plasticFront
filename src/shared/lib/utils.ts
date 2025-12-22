import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserRole } from "../../entities/user/types/types"
import { USER_ROLES } from "../../entities/user/model/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatName = (fullName: string, isFirstSymbol?: boolean): string => {
  if (isFirstSymbol) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((name) => `${name[0].toUpperCase()}`)
      .join("")
  }

  const parts = fullName.trim().split(/\s+/)

  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]

  const [lastName, firstName, patronymic] = parts

  const initials = [firstName, patronymic]
    .filter(Boolean)
    .map((name) => `${name[0].toUpperCase()}.`)
    .join("")

  return `${lastName} ${initials}`
}

export const formatRole = (role: UserRole): string => {
  switch (role) {
    case USER_ROLES.PATIENT:
      return "Пациент"
    case USER_ROLES.DOCTOR:
      return "Доктор"
    case USER_ROLES.CLINIC:
      return "Клиника"
  }
}

export const pluralRu = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
