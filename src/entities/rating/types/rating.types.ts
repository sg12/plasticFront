export interface Rating {
  id: string
  patientId: string
  value: number
  doctorId: string | null
  clinicId: string | null
  reviewId: string | null
  createdAt: string
  updatedAt: string
}

