import { createBrowserRouter } from "react-router"
import { App } from "../App"
import { Main } from "@/pages/main/ui/Main"
import { SignIn } from "@/pages/signIn/ui/SignIn"
import { SignUp } from "@/pages/signUp/ui/SignUp"
import { Dashboard } from "@/pages/dashboard/ui/Dashboard"
import { Profile } from "@/pages/profile/ui/Profile"
import { AIVisualizer } from "@/pages/aiVisualizer/ui/AIVisualizer"
import { Support } from "@/pages/support/ui/Support"
import { General } from "@/widgets/settings/general/ui/General"
import { PersonalData } from "@/widgets/settings/personalData/ui/PersonalData"
import { CreateProfile } from "@/pages/createProfile/ui/CreateProfile"
import { NotFound } from "@/pages/notFound/ui/NotFound"
import { PublicRoute } from "@/app/routers/PublicRoute"
import { ProtectedRoute } from "@/app/routers/ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "signin", element: <SignIn /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "createProfile",
            element: <CreateProfile />,
          },
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
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
