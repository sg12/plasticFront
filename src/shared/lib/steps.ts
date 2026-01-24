export interface StepDefinition<TId = string | number> {
  id: TId
  label: string
}

export function defineSteps<T extends readonly StepDefinition[]>(steps: T): T {
  return steps
}

export function stepsToLabelMap<T extends readonly StepDefinition[]>(
  steps: T,
): Record<T[number]["id"], string> {
  return steps.reduce(
    (acc, step) => {
      acc[step.id as T[number]["id"]] = step.label
      return acc
    },
    {} as Record<T[number]["id"], string>,
  )
}
