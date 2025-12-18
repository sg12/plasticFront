import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "../App";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { Main } from "@/pages/main/ui/Main";
import { SignIn } from "@/pages/signIn/ui/SignIn";
import { SignUp } from "@/pages/signUp/ui/SignUp";

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
          { path: "signin", element: <SignIn /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "main",
            element: <Main />,
            children: [],
          },
        ],
      },
    ],
  },
]);
