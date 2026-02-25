import { USER_ROLE } from "@/entities/user/model/user.constants"
import type { ROLE } from "@/entities/user/types/user.types"
import { defineSteps, stepsToLabelMap, type StepDefinition } from "@/shared/lib/steps"

export const SIGNUP_STEPS_BY_ROLE = {
  [USER_ROLE.PATIENT]: defineSteps([{ id: 1, label: "Основное" }] as const),
  [USER_ROLE.DOCTOR]: defineSteps([
    { id: 1, label: "Основное" },
    { id: 2, label: "Данные врача" },
    { id: 3, label: "Документы" },
  ] as const),
  [USER_ROLE.CLINIC]: defineSteps([
    { id: 1, label: "Основное" },
    { id: 2, label: "Данные клиники" },
    { id: 3, label: "Документы" },
  ] as const),
} as const satisfies Record<ROLE, readonly StepDefinition<number>[]>

export const STEP_LABELS: Record<ROLE, Record<number, string>> = {
  [USER_ROLE.PATIENT]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLE.PATIENT]),
  [USER_ROLE.DOCTOR]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLE.DOCTOR]),
  [USER_ROLE.CLINIC]: stepsToLabelMap(SIGNUP_STEPS_BY_ROLE[USER_ROLE.CLINIC]),
}
