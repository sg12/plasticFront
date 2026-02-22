import type { AUTH_TYPE } from "../model/constants"

export interface Auth {
  readonly id: string
  type: AUTH_TYPE
  email: string
  phone: string
  confirmed: boolean
  emailConfirmedAt: string
  recoverySentAt: string
  lastSignInAt: string
  lastChangePasswordAt: string
}

export type AUTH_TYPE = keyof typeof AUTH_TYPE

export interface LoginResponse {
  email?: string
  accessToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export interface LoginDto {
  readonly email: string
  readonly password: string
}
