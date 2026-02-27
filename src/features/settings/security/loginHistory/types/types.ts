export interface LoginRecord {
  id: string
  userId: string
  ipAddress: string | null
  userAgent: string | null
  browser: string | null
  os: string | null
  device: string | null
  location: string | null
  createdAt: string
  success: boolean
}
