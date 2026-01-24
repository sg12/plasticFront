import React from "react"
import { Check } from "lucide-react"
import type { StepDefinition } from "@/shared/lib/steps"
import { cn } from "@/shared/lib/utils"

export type StepIndicatorStep = StepDefinition

export interface StepIndicatorProps {
  steps: ReadonlyArray<StepIndicatorStep>
  currentStep: StepIndicatorStep["id"]
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6 flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentIndex > index
          const isCurrent = currentIndex === index
          const isPending = currentIndex < index

          return (
            <React.Fragment key={step.id}>
              <div className="relative flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                    isCompleted && "border-[#0070ff] bg-[#0070ff]",
                    isCurrent && "border-[#0070ff] bg-[#EDF6FF]",
                    isPending && "border-[#E5E7EB] bg-white",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent && "text-[#0070ff]",
                        isPending && "text-[#9CA3AF]",
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "absolute top-full mt-2 max-w-[120px] truncate text-center text-xs font-medium whitespace-nowrap",
                    isCurrent && "text-[#0070ff]",
                    !isCurrent && "text-[#6B7280]",
                  )}
                  title={step.label}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 border-t-2 transition-all duration-200",
                    isCompleted ? "border-[#0070ff]" : "border-[#E5E7EB]",
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
