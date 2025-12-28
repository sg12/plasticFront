import useSWR from "swr"
import { useAuthStore } from "@/entities/auth/model/store"
import { getUser } from "../api/api"
import type { PatientProfile, DoctorProfile, ClinicProfile } from "../types/types"

type UserProfile = PatientProfile | DoctorProfile | ClinicProfile

export const useUserProfile = (userId?: string) => {
  const { user } = useAuthStore()
  const targetUserId = userId || user?.id

  const { data, error, isLoading, mutate } = useSWR<UserProfile | null>(
    targetUserId ? ["userProfile", targetUserId] : null,
    () => {
      if (!targetUserId) {
        throw new Error("User ID is required")
      }
      return getUser(targetUserId)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,
      errorRetryCount: 2,
      errorRetryInterval: 1000,
      shouldRetryOnError: (error) => {
        const errorMessage = error?.message?.toLowerCase() || ""
        return errorMessage.includes("network") || errorMessage.includes("timeout")
      },
      onError: (error) => {
        console.error("Error loading user profile:", error)
      },
    },
  )

  return {
    profile: data ?? null,
    isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  }
}
