import ReactDOM from "react-dom/client"
import { Toaster } from "sonner"
import { RouterProvider } from "react-router-dom"
import { router } from "./routers/Router"
import { ErrorBoundary } from "react-error-boundary"
import { SWRConfig } from "swr"
import { Fallback } from "@/app/fallback/Fallback"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      console.log("Error boundary reset:", details)
    }}
    onError={(error, errorInfo) => {
      console.error("Error caught by boundary:", error, errorInfo)
    }}
  >
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5 * 60 * 1000,
        errorRetryCount: 2,
        errorRetryInterval: 1000,
        shouldRetryOnError: (error) => {
          const errorMessage = error?.message?.toLowerCase() || ""
          return errorMessage.includes("network") || errorMessage.includes("timeout")
        },
        onError: (error, key) => {
          console.error(`SWR error for key "${key}":`, error)
        },
      }}
    >
      <RouterProvider router={router} />
      <Toaster />
    </SWRConfig>
  </ErrorBoundary>,
)
