export interface Consent {
  id: string
  type: ConsentType
  title: string
  description: string
  isActive: boolean
  grantedAt: string | null
  revokedAt: string | null
  isRequired: boolean
}

export type ConsentType = "personalData" | "medicalData" | "marketing" | "analytics"
