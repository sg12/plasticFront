export type StepId = string | number;

export interface StepDefinition<Id extends StepId = StepId> {
  id: Id;
  label: string;
}

export function defineSteps<const T extends readonly StepDefinition[]>(steps: T): T {
  return steps;
}

export function stepsToLabelMap<const T extends readonly StepDefinition[]>(
  steps: T
): Record<T[number]["id"], string> {
  return Object.fromEntries(steps.map((s) => [s.id, s.label])) as Record<
    T[number]["id"],
    string
  >;
}


