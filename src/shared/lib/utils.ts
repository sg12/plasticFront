import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Gender, UserRole } from "../../entities/user/types/types"
import { USER_ROLES } from "../../entities/user/model/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatName = (
  fullName: string | null,
  isFirstSymbol?: boolean,
  parts?: "firstName" | "lastName" | "patronymic",
): string => {
  if (!fullName) {
    return ""
  }
  if (isFirstSymbol) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((name) => `${name[0].toUpperCase()}`)
      .join("")
  }

  const partsOfFullName = fullName.trim().split(/\s+/)

  if (partsOfFullName.length === 0) return ""
  if (partsOfFullName.length === 1) return partsOfFullName[0]

  const [lastName, firstName, patronymic] = partsOfFullName

  if (parts) {
    switch (parts) {
      case "lastName":
        return lastName ?? ""
      case "firstName":
        return firstName ?? ""
      case "patronymic":
        return patronymic ?? ""
    }
  }

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

export const formatGender = (value: Gender) => {
  return value === "male" ? "Мужской" : value === "female" ? "Женский" : ""
}

export const pluralRu = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
