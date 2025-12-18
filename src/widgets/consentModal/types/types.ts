import type { UserRole } from "@/entities/user/types/types";

export interface ConsentModalProps {
  userRole: UserRole;
  onAccept: () => void;
  onDecline: () => void;
  onShowPrivacyModal: () => void;
}
