import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Gender, UserRole } from "../../entities/user/types/user.types"
import { USER_ROLES } from "../../entities/user/model/user.constants"

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

export const pluralRu = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  let word: string

  if (mod100 >= 11 && mod100 <= 14) {
    word = many
  } else if (mod10 === 1) {
    word = one
  } else if (mod10 >= 2 && mod10 <= 4) {
    word = few
  } else {
    word = many
  }

  return `${n} ${word}`
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return ""
  let cleaned = phoneNumber.replace(/\D/g, "")
  if (cleaned.startsWith("8")) {
    cleaned = "7" + cleaned.slice(1)
  }
  if (cleaned.startsWith("7")) {
    cleaned = cleaned.slice(1)
  }

  // Форматируем: (999) 999-99-99
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (match) {
    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
  }

  return phoneNumber
}
