import type { CONSENT_TYPE } from "../model/consent.constants"

export interface Consent {
  id: string
  type: CONSENT_TYPE
  version: string
  title: string
  text: string
  isRequired: boolean
  isPublished: boolean
  createdAt: string
  userConsents: UserConsent[]
}

export interface UserConsent {
  id: string
  userId: string
  consentId: string
  ipAddress: string | null
  userAgent: string | null
  signedAt: string
  revokedAt: string | null
}

export type CONSENT_TYPE = keyof typeof CONSENT_TYPE
