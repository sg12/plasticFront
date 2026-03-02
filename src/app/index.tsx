import ReactDOM from "react-dom/client"
import { Toaster } from "sonner"
import { RouterProvider } from "react-router"
import { router } from "./routers/Router"
import { ErrorBoundary } from "react-error-boundary"
import { Fallback } from "@/app/fallback/Fallback"
import { logger } from "@/shared/lib/logger"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./index.css"

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  </ErrorBoundary>,
)
