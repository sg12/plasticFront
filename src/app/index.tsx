import ReactDOM from "react-dom/client"
import { Toaster } from "sonner"
import { RouterProvider } from "react-router"
import { router } from "./routers/Router"
import { ErrorBoundary } from "react-error-boundary"
import { SWRConfig } from "swr"
import { Fallback } from "@/app/fallback/Fallback"
import { logger } from "@/shared/lib/logger"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      logger.info("Error boundary reset", { details })
    }}
    onError={(error, errorInfo) => {
      logger.error("Error caught by boundary", error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      })
    }}
  >
    <SWRConfig
      value={{
        shouldRetryOnError: (error) => {
          const errorMessage = error?.message?.toLowerCase() || ""
          return errorMessage.includes("network") || errorMessage.includes("timeout")
        },
        onError: (error, key) => {
          logger.error(`SWR error for key "${key}"`, error as Error, {
            swrKey: key,
            errorType: "swr",
          })
        },
      }}
    >
      <RouterProvider router={router} />
      <Toaster />
    </SWRConfig>
  </ErrorBoundary>,
)
