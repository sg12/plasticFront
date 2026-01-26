import { createBrowserRouter } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { Loader } from "@/shared/ui/loader"
import { lazyRoute } from "./lazyRoute"
import { USER_ROLES } from "@/entities/user/model/constants"

export const router = createBrowserRouter([
  {
    // loader: () => redirect(ROUTES.SIGNIN),
    HydrateFallback: () => <Loader message="Загрузка приложения..." />,
    ...lazyRoute(() => import("@/app/App"), "App"),
    children: [
      {
        ...lazyRoute(() => import("@/app/routers/PublicRoute"), "PublicRoute"),
        children: [
          {
            path: ROUTES.SIGNIN,
            ...lazyRoute(() => import("@/pages/signIn/ui/SignIn"), "SignIn"),
          },
          {
            path: ROUTES.SIGNUP,
            ...lazyRoute(() => import("@/pages/signUp/ui/SignUp"), "SignUp"),
          },
        ],
      },
      {
        ...lazyRoute(() => import("@/app/routers/ProtectedRoute"), "ProtectedRoute"),
        children: [
          {
            path: ROUTES.CREATE_PROFILE,
            ...lazyRoute(() => import("@/pages/createProfile/ui/CreateProfile"), "CreateProfile"),
          },
          {
            path: ROUTES.MAIN,
            ...lazyRoute(() => import("@/pages/main/ui/Main"), "Main"),
            children: [
              {
                index: true,
                ...lazyRoute(() => import("@/pages/dashboard/ui/Dashboard"), "Dashboard"),
                handle: { title: "Главная" },
              },
              {
                path: ROUTES.PROFILE_SOME_USER,
                ...lazyRoute(() => import("@/pages/profile/ui/Profile"), "Profile"),
                handle: { title: "Профиль пользователя" },
              },
              {
                path: ROUTES.PROFILE,
                ...lazyRoute(() => import("@/pages/profile/ui/Profile"), "Profile"),
                handle: { title: "Профиль" },
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLES.PATIENT, USER_ROLES.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.CATALOG,
                    ...lazyRoute(() => import("@/pages/catalog/ui/Catalog"), "Catalog"),
                    handle: { title: "Каталог" },
                  },
                ],
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLES.CLINIC],
                },
                children: [
                  {
                    path: ROUTES.CLINIC_DOCTORS,
                    ...lazyRoute(
                      () => import("@/pages/clinicDoctors/ui/ClinicDoctors"),
                      "ClinicDoctors",
                    ),
                    handle: { title: "Врачи клиники" },
                  },
                ],
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLES.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.DOCTOR_CLINICS,
                    ...lazyRoute(
                      () => import("@/pages/doctorClinics/ui/DoctorClinics"),
                      "DoctorClinics",
                    ),
                    handle: { title: "Клиники" },
                  },
                ],
              },
              {
                path: ROUTES.AIVISUALIZER,
                ...lazyRoute(() => import("@/pages/aiVisualizer/ui/AIVisualizer"), "AIVisualizer"),
                handle: { title: "AI Визуализатор" },
              },
              {
                path: ROUTES.SUPPORT,
                ...lazyRoute(() => import("@/pages/support/ui/Support"), "Support"),
                handle: { title: "Поддержка" },
              },
              {
                path: ROUTES.APPOINTMENTS,
                ...lazyRoute(() => import("@/pages/appointments/ui/Appointments"), "Appointments"),
                handle: { title: "Записи на приём" },
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLES.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.DOCTOR_SCHEDULE,
                    ...lazyRoute(
                      () => import("@/pages/doctorSchedule/ui/DoctorSchedule"),
                      "DoctorSchedule",
                    ),
                    handle: { title: "Расписание врача" },
                  },
                ],
              },
              {
                path: ROUTES.SETTINGS,
                handle: { title: "Настройки" },
                children: [
                  {
                    path: ROUTES.GENERAL,
                    ...lazyRoute(() => import("@/pages/settings/general/General"), "General"),
                    handle: { title: "Основные настройки" },
                  },
                  {
                    path: ROUTES.PERSONAL_DATA,
                    ...lazyRoute(
                      () => import("@/pages/settings/personalData/PersonalData"),
                      "PersonalData",
                    ),
                    handle: { title: "Персональные данные" },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        ...lazyRoute(() => import("@/pages/notFound/ui/NotFound"), "NotFound"),
      },
    ],
  },
])
