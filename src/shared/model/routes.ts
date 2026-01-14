export const ROUTES = {
  LANDING: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  CREATE_PROFILE: "/createProfile",
  MAIN: "/main",
  PROFILE: "/main/profile",
  PROFILE_SOME_USER: "/main/profile/:userId",
  CATALOG: "/main/catalog",
  AIVISUALIZER: "/main/ai",
  SUPPORT: "/main/support",
  SETTINGS: "/main/settings",
  GENERAL: "/main/settings/general",
  PERSONAL_DATA: "/main/settings/personalData",
  CLINIC_DOCTORS: "/main/clinic/doctors",
  DOCTOR_CLINICS: "/main/doctor/clinics",
}

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
