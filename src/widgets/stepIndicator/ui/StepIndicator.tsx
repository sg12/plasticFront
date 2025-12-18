import type { UserRole } from "@/entities/user/types/types";
import { STEP_LABELS } from "@/features/signUp/model/constants";
import { Check } from "lucide-react";
import type { StepIndicatorProps } from "../types/types";

export function StepIndicator({ userRole, currentStep }: StepIndicatorProps) {
  if (userRole === "patient") return null;

  const steps = Object.keys(STEP_LABELS[userRole]).map(Number);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center nth-[-n+2]:w-full">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep > step
                    ? "bg-purple-600 border-purple-600"
                    : currentStep === step
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {currentStep > step ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm ${
                      currentStep === step ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                )}
              </div>
              <span
                className={`absolute top-full text-xs mt-2 text-center whitespace-nowrap ${
                  currentStep === step ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {
                  STEP_LABELS[userRole][
                    step as keyof (typeof STEP_LABELS)[UserRole]
                  ]
                }
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0 w-full mx-4 border-t-2 border-dashed transition-all ${
                  currentStep > step ? "border-purple-600" : "border-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
