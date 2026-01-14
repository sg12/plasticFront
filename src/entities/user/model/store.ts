/**
 * @fileoverview Zustand store для управления данными пользователя
 *
 * Отвечает за:
 * - Хранение профиля пользователя
 * - Загрузку и обновление профиля
 * - Обработку действий после логина, связанных с профилем
 *
 * @module entities/user/model/store
 */

import { create } from "zustand"
import { getUser } from "../api/api"
import type { RoleProfile, TypedProfile, UserRole } from "../types/types"
import { USER_ROLES } from "./constants"
import { requestModeration } from "@/shared/api/supabase/moderation"
import { getFileUrls } from "@/entities/document/api/api"
import type { DoctorProfile, ClinicProfile } from "../types/types"
import { logger } from "@/shared/lib/logger"
import { toast } from "sonner"

interface UserState<T extends RoleProfile = RoleProfile> {
  /** Профиль пользователя */
  profile: T | null
  /** Состояние загрузки */
  isLoading: boolean
  /** Ошибка загрузки */
  error: string | null
}

interface UserStore extends UserState {
  /** Загрузить профиль пользователя */
  loadProfile: (userId: string) => Promise<RoleProfile | null>
  /** Обновить профиль в store */
  setProfile: <R extends UserRole = UserRole>(profile: TypedProfile<R> | null) => void
  /** Установить состояние загрузки */
  setLoading: (loading: boolean) => void
  /** Установить ошибку */
  setError: (error: string | null) => void
  /** Обработка действий после логина, связанных с профилем */
  handlePostLoginActions: (userId: string) => Promise<void>
  /** Сбросить состояние */
  reset: () => void
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  loadProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      logger.debug("Начало загрузки профиля", { userId })

      const profile = await getUser(userId)

      set({ profile, isLoading: false })
      logger.info("Профиль успешно загружен", {
        userId,
        role: profile?.role,
      })
      return profile
    } catch (error) {
      logger.error("Ошибка загрузки профиля", error as Error, { userId })
      set({ error: "Ошибка при загрузке профиля", isLoading: false })
      return null
    }
  },

  setProfile: (profile) => set({ profile }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  handlePostLoginActions: async (userId: string) => {
    const profile = get().profile

    if (!profile || !profile.role) return

    try {
      const isDoctorOrClinic =
        profile.role === USER_ROLES.DOCTOR || profile.role === USER_ROLES.CLINIC

      if (isDoctorOrClinic && profile.moderationStatus !== "approved") {
        let files: Array<{ name: string; url?: string }> = []

        const roleProfile = profile as DoctorProfile | ClinicProfile

        const doctorProfile = profile as DoctorProfile
        const clinicProfile = profile as ClinicProfile

        if (roleProfile.documents) {
          files = await getFileUrls(roleProfile.documents)
        }

        const documentsRecord: Record<string, string> = files.reduce(
          (acc, file) => {
            if (file.url) {
              acc[file.name] = file.url
            }
            return acc
          },
          {} as Record<string, string>,
        )

        const resultModeration = await requestModeration({
          id: userId,
          role: profile.role,
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          moderationStatus: profile.moderationStatus,
          moderationComment: profile.moderationComment,
          moderatedAt: profile.moderatedAt,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,

          birthDate: doctorProfile.birthDate,
          gender: doctorProfile.gender,

          licenseNumber: doctorProfile.licenseNumber,
          specialization: doctorProfile.specialization,
          experience: doctorProfile.experience,
          education: doctorProfile.education,
          workplace: doctorProfile.workplace,
          inn: doctorProfile.inn,

          legalName: clinicProfile.legalName,
          clinicInn: clinicProfile.clinicInn,
          ogrn: clinicProfile.ogrn,
          legalAddress: clinicProfile.legalAddress,
          actualAddress: clinicProfile.actualAddress,
          clinicLicense: clinicProfile.clinicLicense,
          directorName: clinicProfile.directorName,
          directorPosition: clinicProfile.directorPosition,

          documents: documentsRecord,
        } as Parameters<typeof requestModeration>[0])

        if (resultModeration.data.code === "ALREADY_SUBMITTED") {
          logger.info("Запрос на модерацию уже был отправлен", {
            userId,
            role: profile.role,
          })
          toast.message("Запрос уже был отправлен, ожидайте.", {
            description: resultModeration.data.message,
          })
          return
        }
        logger.info("Запрос на модерацию успешно отправлен", {
          userId,
          role: profile.role,
        })
      }
    } catch (error) {
      logger.error("Ошибка при проверке модерации", error as Error, {
        userId,
        role: profile?.role,
      })
    }
  },

  reset: () => {
    set({ ...initialState })
    logger.debug("User store сброшен")
  },
}))
