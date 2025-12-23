import React from "react"
import ReactDOM from "react-dom/client"
import { Toaster } from "sonner"
import { RouterProvider } from "react-router-dom"
import { router } from "./routers/Router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)
