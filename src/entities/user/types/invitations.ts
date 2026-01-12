/**
 * Статус приглашения врача в клинику
 */
export type ClinicMembershipStatus = "pending" | "accepted" | "rejected" | "left"

/**
 * Информация о враче в контексте клиники
 */
export interface ClinicDoctorInfo {
  id: string
  fullName: string
  email?: string
  phone?: string
  specialization?: string | null
  experience?: number | null
  licenseNumber?: string | null
}

/**
 * Информация о клинике в контексте врача
 */
export interface DoctorClinicInfo {
  id: string
  legalName: string
  actualAddress?: string | null
}

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
  /** Информация о враче (опционально, заполняется при запросе списка врачей клиники) */
  doctor?: ClinicDoctorInfo
  /** Информация о клинике (опционально, заполняется при запросе списка приглашений) */
  clinic?: DoctorClinicInfo
}
