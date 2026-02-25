export const ROUTES = {
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  CREATE_PROFILE: "/create-profile",
  POLICIES: "/policies/:id",
  MAIN: "/",
  PROFILE: "/profile",
  PROFILE_SOME_USER: "/profile/:userId",
  CATALOG: "/catalog",
  AIVISUALIZER: "/ai",
  SUPPORT: "/support",
  APPOINTMENTS: "/appointments",
  DOCTOR_SCHEDULE: "/doctor/schedule",
  SETTINGS: "/settings",
  GENERAL: "/settings/general",
  PERSONAL_DATA: "/settings/personal-data",
  CLINIC_DOCTORS: "/clinic/doctors",
  DOCTOR_CLINICS: "/doctor/clinics",
} as const

export type PathParams = {
  [ROUTES.PROFILE_SOME_USER]: {
    userId: string
  }
}

declare module "react-router" {
  interface Register {
    params: PathParams
  }
}
