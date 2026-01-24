import { USER_ROLES } from "@/entities/user/model/constants"
import type { UserRole } from "@/entities/user/types/types"
import { defineSteps, stepsToLabelMap, type StepDefinition } from "@/shared/lib/steps"

export const SIGNUP_STEPS_BY_ROLE = {
  [USER_ROLES.PATIENT]: defineSteps([{ id: 1, label: "Основное" }] as const),
  [USER_ROLES.DOCTOR]: defineSteps([
    { id: 1, label: "Основное" },
    { id: 2, label: "Данные врача" },
    { id: 3, label: "Документы" },
  ] as const),
  [USER_ROLES.CLINIC]: defineSteps([
    { id: 1, label: "Основное" },
    { id: 2, label: "Данные клиники" },
    { id: 3, label: "Документы" },
  ] as const),
} as const satisfies Record<UserRole, readonly StepDefinition<number>[]>

export const STEP_LABELS: Record<UserRole, Record<number, string>> = {
  [USER_ROLES.PATIENT]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLES.PATIENT]),
  [USER_ROLES.DOCTOR]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLES.DOCTOR]),
  [USER_ROLES.CLINIC]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLES.CLINIC]),
}
