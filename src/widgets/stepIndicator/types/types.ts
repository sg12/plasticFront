import type { UserRole } from "@/entities/user/types/types";

export interface StepIndicatorProps {
  userRole: UserRole;
  currentStep: number;
}
