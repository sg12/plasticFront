export interface LoginRecord {
    id: string
    user_id: string
    ip_address: string | null
    user_agent: string | null
    browser: string | null
    os: string | null
    device: string | null
    location: string | null
    created_at: string
    success: boolean
  }