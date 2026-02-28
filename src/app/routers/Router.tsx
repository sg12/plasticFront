import { createBrowserRouter } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { Loader } from "@/shared/ui/loader"
import { lazyRoute } from "./lazyRoute"
import { USER_ROLE } from "@/entities/user/model/user.constants"

export const router = createBrowserRouter([
  {
    HydrateFallback: () => <Loader message="Загрузка приложения..." />,
    ...lazyRoute(() => import("@/app/App"), "App"),
    children: [
      {
        ...lazyRoute(() => import("@/app/routers/PublicRoute"), "PublicRoute"),
        children: [
          {
            path: ROUTES.SIGNIN,
            ...lazyRoute(() => import("@/pages/sign-in/ui/SignInPage"), "SignInPage"),
          },
          {
            path: ROUTES.SIGNUP,
            ...lazyRoute(() => import("@/pages/sign-up/ui/SignUpPage"), "SignUpPage"),
          },
        ],
      },
      {
        path: ROUTES.POLICIES,
        ...lazyRoute(() => import("@/pages/policies/ui/PoliciesPage"), "PoliciesPage"),
      },
      {
        ...lazyRoute(() => import("@/app/routers/ProtectedRoute"), "ProtectedRoute"),
        children: [
          {
            path: ROUTES.CREATE_PROFILE,
            ...lazyRoute(() => import("@/pages/create-profile/ui/CreateProfilePage"), "CreateProfilePage"),
          },
          {
            path: ROUTES.MAIN,
            ...lazyRoute(() => import("@/pages/main/ui/MainPage"), "MainPage"),
            children: [
              {
                index: true,
                ...lazyRoute(() => import("@/pages/dashboard/ui/DashboardPage"), "DashboardPage"),
                handle: { title: "Главная" },
              },
              {
                path: ROUTES.PROFILE_SOME_USER,
                ...lazyRoute(() => import("@/pages/profile/ui/ProfilePage"), "ProfilePage"),
                handle: { title: "Профиль пользователя" },
              },
              {
                path: ROUTES.PROFILE,
                ...lazyRoute(() => import("@/pages/profile/ui/ProfilePage"), "ProfilePage"),
                handle: { title: "Профиль" },
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLE.PATIENT, USER_ROLE.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.CATALOG,
                    ...lazyRoute(() => import("@/pages/catalog/ui/CatalogPage"), "CatalogPage"),
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
                  allowedRoles: [USER_ROLE.CLINIC],
                },
                children: [
                  {
                    path: ROUTES.CLINIC_DOCTORS,
                    ...lazyRoute(
                      () => import("@/pages/clinic-doctors/ui/ClinicDoctorsPage"),
                      "ClinicDoctorsPage",
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
                  allowedRoles: [USER_ROLE.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.DOCTOR_CLINICS,
                    ...lazyRoute(
                      () => import("@/pages/doctor-clinics/ui/DoctorClinicsPage"),
                      "DoctorClinicsPage",
                    ),
                    handle: { title: "Клиники" },
                  },
                ],
              },
              {
                path: ROUTES.AIVISUALIZER,
                ...lazyRoute(() => import("@/pages/ai-visualizer/ui/AIVisualizer"), "AIVisualizer"),
                handle: { title: "AI Визуализатор" },
              },
              {
                path: ROUTES.SUPPORT,
                ...lazyRoute(() => import("@/pages/support/ui/SupportPage"), "SupportPage"),
                handle: { title: "Поддержка" },
              },
              {
                path: ROUTES.APPOINTMENTS,
                ...lazyRoute(() => import("@/pages/appointments/ui/AppointmentsPage"), "AppointmentsPage"),
                handle: { title: "Записи на приём" },
              },
              {
                ...lazyRoute(
                  () => import("@/app/routers/RoleProtectedRoute"),
                  "RoleProtectedRoute",
                ),
                handle: {
                  allowedRoles: [USER_ROLE.DOCTOR],
                },
                children: [
                  {
                    path: ROUTES.DOCTOR_SCHEDULE,
                    ...lazyRoute(
                      () => import("@/pages/doctor-schedule/ui/DoctorSchedulePage"),
                      "DoctorSchedulePage",
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
                    ...lazyRoute(() => import("@/pages/settings/general/GeneralPage"), "GeneralPage"),
                    handle: { title: "Основные настройки" },
                  },
                  {
                    path: ROUTES.PERSONAL_DATA,
                    ...lazyRoute(
                      () => import("@/pages/settings/personalData/PersonalData"),
                      "PersonalDataPage",
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
        ...lazyRoute(() => import("@/pages/not-found/ui/NotFoundPage"), "NotFoundPage"),
      },
    ],
  },
])
