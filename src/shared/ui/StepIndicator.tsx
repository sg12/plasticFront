import { Check } from "lucide-react"
import type { StepDefinition } from "@/shared/lib/steps"

export type StepIndicatorStep = StepDefinition

export interface StepIndicatorProps {
  steps: ReadonlyArray<StepIndicatorStep>
  currentStep: StepIndicatorStep["id"]
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  let nth = steps.length - 1

  return (
    <div className={className ?? "mb-12"}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex items-center nth-[-n+${nth}]:w-full`}>
            <div className="relative flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  currentIndex > index
                    ? "border-purple-600 bg-purple-600"
                    : currentIndex === index
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300 bg-white"
                }`}
              >
                {currentIndex > index ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm ${
                      currentIndex === index ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`absolute top-full mt-2 text-center text-xs whitespace-nowrap ${
                  currentIndex === index ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0 w-full border-t-2 border-dashed transition-all ${
                  currentIndex > index ? "border-purple-600" : "border-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
