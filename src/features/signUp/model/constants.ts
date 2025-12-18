import { USER_ROLES } from "@/entities/user/model/constants";
import type { UserRole } from "@/entities/user/types/types";

export const STEP_LABELS: Record<UserRole, Record<number, string>> = {
    [USER_ROLES.PATIENT]: {
      1: 'Основное',
    },
    [USER_ROLES.DOCTOR]: {
      1: 'Основное',
      2: 'Данные врача',
      3: 'Документы',
    },
    [USER_ROLES.CLINIC]: {
      1: 'Основное',
      2: 'Данные клиники',
      3: 'Документы',
    },
  };