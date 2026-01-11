/**
 * Статус приглашения врача в клинику
 */
export type ClinicMembershipStatus = "pending" | "accepted" | "rejected" | "left"

/**
 * Связь врача с клиникой (членство через приглашение)
 */
export interface ClinicMembership {
  /** ID записи о членстве */
  id: string
  /** ID врача */
  doctorId: string
  /** ID клиники */
  clinicId: string
  /** Статус приглашения/членства */
  status: ClinicMembershipStatus
  /** Дата отправки приглашения */
  invitedAt: string
  /** Дата принятия приглашения (если принято) */
  acceptedAt: string | null
  /** Дата создания записи */
  createdAt?: string
  /** Информация о клинике (для удобства, заполняется при запросах) */
  clinic?: {
    id: string
    legalName: string
    actualAddress: string | null
  }
}
