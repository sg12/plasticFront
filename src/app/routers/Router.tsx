import { createBrowserRouter } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { Loader } from "@/shared/ui/loader"

export const router = createBrowserRouter([
  {
    path: "/",
    HydrateFallback: () => <Loader message="Загрузка приложения..." />,
    lazy: async () =>
      import("@/app/App").then((module) => ({
        Component: module.App,
      })),
    children: [
      {
        lazy: () =>
          import("@/app/routers/PublicRoute").then((module) => ({
            Component: module.PublicRoute,
          })),
        children: [
          {
            path: ROUTES.SIGNIN,
            lazy: () =>
              import("@/pages/signIn/ui/SignIn").then((module) => ({
                Component: module.SignIn,
              })),
          },
          {
            path: ROUTES.SIGNUP,
            lazy: () =>
              import("@/pages/signUp/ui/SignUp").then((module) => ({
                Component: module.SignUp,
              })),
          },
        ],
      },
      {
        lazy: () =>
          import("@/app/routers/ProtectedRoute").then((module) => ({
            Component: module.ProtectedRoute,
          })),
        children: [
          {
            path: ROUTES.CREATE_PROFILE,
            lazy: () =>
              import("@/pages/createProfile/ui/CreateProfile").then((module) => ({
                Component: module.CreateProfile,
              })),
          },
          {
            path: ROUTES.MAIN,
            lazy: () =>
              import("@/pages/main/ui/Main").then((module) => ({
                Component: module.Main,
              })),
            children: [
              {
                index: true,
                lazy: () =>
                  import("@/pages/dashboard/ui/Dashboard").then((module) => ({
                    Component: module.Dashboard,
                  })),
                handle: { title: "Главная" },
              },
              {
                path: ROUTES.PROFILE,
                lazy: () =>
                  import("@/pages/profile/ui/Profile").then((module) => ({
                    Component: module.Profile,
                  })),
                handle: { title: "Профиль" },
              },
              {
                path: ROUTES.AIVISUALIZER,
                lazy: () =>
                  import("@/pages/aiVisualizer/ui/AIVisualizer").then((module) => ({
                    Component: module.AIVisualizer,
                  })),
                handle: { title: "AI Визуализатор" },
              },
              {
                path: ROUTES.SUPPORT,
                lazy: () =>
                  import("@/pages/support/ui/Support").then((module) => ({
                    Component: module.Support,
                  })),
                handle: { title: "Поддержка" },
              },
              {
                path: ROUTES.SETTINGS,
                handle: { title: "Настройки" },
                children: [
                  {
                    path: ROUTES.GENERAL,
                    lazy: () =>
                      import("@/widgets/settings/general/ui/General").then((module) => ({
                        Component: module.General,
                      })),
                    handle: { title: "Основные настройки" },
                  },
                  {
                    path: ROUTES.PERSONAL_DATA,
                    lazy: () =>
                      import("@/widgets/settings/personalData/ui/PersonalData").then((module) => ({
                        Component: module.PersonalData,
                      })),
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
        lazy: () =>
          import("@/pages/notFound/ui/NotFound").then((module) => ({
            Component: module.NotFound,
          })),
      },
    ],
  },
])
