import axios from "axios"
import { ROUTES } from "../model/routes"
import type { RefreshResponse } from "@/entities/auth/types/auth.types"
import { useAuthStore } from "@/entities/auth/model/auth.store"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true
      const setToken = useAuthStore.getState().setToken

      try {
        const { data } = await axios.post<RefreshResponse>(
          "/auth/refresh",
          {},
          {
            baseURL: import.meta.env.VITE_API_URL,
            withCredentials: true,
          },
        )

        setToken(data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        setToken(null)
        window.location.href = ROUTES.SIGNIN
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
