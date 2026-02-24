import axios from "axios"
import { refresh } from "@/entities/auth/api/auth.api"
import { ROUTES } from "../model/routes"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
      error.config._isRetry = true

      try {
        const response = await refresh()

        if (response) {
          localStorage.setItem("token", response.accessToken)
        }

        return api.request(error.config)
      } catch (refreshError) {
        localStorage.removeItem("token")
        window.location.href = ROUTES.SIGNIN
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
