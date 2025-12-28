import { createBrowserRouter, Navigate } from "react-router-dom"
import { App } from "../App"
import { PublicRoute } from "./PublicRoute"
import { ProtectedRoute } from "./ProtectedRoute"
import { Main } from "@/pages/main/ui/Main"
import { SignIn } from "@/pages/signIn/ui/SignIn"
import { SignUp } from "@/pages/signUp/ui/SignUp"
import { Dashboard } from "@/pages/dashboard/ui/Dashboard"
import { Profile } from "@/pages/profile/ui/Profile"
import { AIVisualizer } from "@/pages/aiVisualizer/ui/AIVisualizer"
import { Support } from "@/pages/support/ui/Support"
import { General } from "@/widgets/settings/general/ui/General"
import { PersonalData } from "@/widgets/settings/personalData/ui/PersonalData"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/main" replace />,
      },
      {
        element: <PublicRoute />,
        children: [
          { path: "signin", element: <SignIn />, handle: { title: "Вход" } },
          { path: "signup", element: <SignUp />, handle: { title: "Регистрация" } },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "main",
            element: <Main />,
            handle: { title: "Главная" },
            children: [
              { index: true, element: <Dashboard />, handle: { title: "Главная" } },
              { path: "profile", element: <Profile />, handle: { title: "Профиль" } },
              { path: "ai", element: <AIVisualizer />, handle: { title: "AI Визуализатор" } },
              { path: "support", element: <Support />, handle: { title: "Поддержка" } },
              {
                path: "settings",
                // element: <Settings />,
                handle: { title: "Настройки" },
                children: [
                  {
                    path: "general",
                    element: <General />,
                    handle: { title: "Основные настройки" },
                  },
                  {
                    path: "personalData",
                    element: <PersonalData />,
                    handle: { title: "Персональные данные" },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
