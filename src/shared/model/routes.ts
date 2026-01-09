export const ROUTES = {
  LANDING: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  CREATE_PROFILE: "/createProfile",
  MAIN: "/main",
  PROFILE: "/main/profile",
  PROFILE_USER: "/main/profile/:userId",
  CATALOG: "/main/catalog",
  AIVISUALIZER: "/main/ai",
  SUPPORT: "/main/support",
  SETTINGS: "/main/settings",
  GENERAL: "/main/settings/general",
  PERSONAL_DATA: "/main/settings/personalData",
}

export type PathParams = {
  [ROUTES.PROFILE]: {
    userId: string
  }
}

declare module "react-router" {
  interface Register {
    params: PathParams
  }
}
