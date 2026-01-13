/**
 * @fileoverview Zustand store для управления состоянием каталога
 *
 * Этот store хранит:
 * - Фильтры поиска (по умолчанию)
 * - Избранное (синхронизируется с базой данных через patientProfiles.favoriteDoctors/favoriteClinics)
 *
 * @module features/catalog/model/store
 */

import { create } from "zustand"
import type { DoctorSearchParams, ClinicSearchParams } from "../types/types"
import { DEFAULT_DOCTOR_SEARCH_PARAMS, DEFAULT_CLINIC_SEARCH_PARAMS } from "./constants"
import { logger } from "@/shared/lib/logger"
import { addFavorite, removeFavorite } from "@/entities/user/api/api"
import { useAuthStore } from "@/entities/auth/model/store"
import { toast } from "sonner"
import type { PatientProfile, RoleProfile, UserRole } from "@/entities/user/types/types"
import { USER_ROLES } from "@/entities/user/model/constants"
import { useUserStore } from "@/entities/user/model/store"

interface CatalogState {
  // === ФИЛЬТРЫ ===
  doctorFilters: DoctorSearchParams
  clinicFilters: ClinicSearchParams

  // === ИЗБРАННОЕ ===
  favoriteDoctors: string[]
  favoriteClinics: string[]

  // === ДЕЙСТВИЯ (Actions) ===
  toggleFavorite: (favoriteId: string, who: UserRole) => Promise<void>
  syncFavoritesFromProfile: (favorites: { favoriteDoctors: string[]; favoriteClinics: string[] }) => void

  clearFilters: () => void
  reset: () => void
}

// Получаем избранное из профиля, если он уже загружен
const getInitialFavorites = () => {
  const profile = useUserStore.getState().profile
  if (profile && profile.role === USER_ROLES.PATIENT) {
    const patientProfile = profile as PatientProfile
    return {
      favoriteDoctors: patientProfile.favoriteDoctors || [],
      favoriteClinics: patientProfile.favoriteClinics || [],
    }
  }
  return {
    favoriteDoctors: [],
    favoriteClinics: [],
  }
}

const initialState = {
  doctorFilters: DEFAULT_DOCTOR_SEARCH_PARAMS,
  clinicFilters: DEFAULT_CLINIC_SEARCH_PARAMS,

  // Избранное (инициализируется из профиля, если он уже загружен)
  ...getInitialFavorites(),
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  ...initialState,

  syncFavoritesFromProfile: (favorites) => {
    set({
      favoriteDoctors: favorites.favoriteDoctors,
      favoriteClinics: favorites.favoriteClinics,
    })
    logger.debug("Избранное синхронизировано из профиля", {
      doctorsCount: favorites.favoriteDoctors.length,
      clinicsCount: favorites.favoriteClinics.length,
    })
  },

  toggleFavorite: async (favoriteId, who) => {
    const userId = useAuthStore.getState().session?.user?.id
    if (!userId) {
      logger.warn("Попытка добавить в избранное без авторизации")
      return
    }

    // Получаем текущее состояние
    const currentFavorites = who === "doctor" ? get().favoriteDoctors : get().favoriteClinics
    const isFavorite = currentFavorites.includes(favoriteId)

    const optimisticFavorites = isFavorite
      ? currentFavorites.filter((id) => id !== favoriteId) // Удаляем
      : [...currentFavorites, favoriteId] // Добавляем

    if (who === "doctor") {
      set({ favoriteDoctors: optimisticFavorites })
    } else {
      set({ favoriteClinics: optimisticFavorites })
    }

    isFavorite
      ? toast.info(`${who === "doctor" ? "Врач" : "Клиника"} удален из избранного`)
      : toast.success(`${who === "doctor" ? "Врач" : "Клиника"} добавлен в избранное`)

    logger.info(
      isFavorite
        ? `${who === "doctor" ? "Врач" : "Клиника"} удален из избранного (оптимистично)`
        : `${who === "doctor" ? "Врач" : "Клиника"} добавлен в избранное (оптимистично)`,
      {
        userId,
        favoriteId,
      },
    )

    try {
      const serverFavorites = isFavorite
        ? await removeFavorite(userId, favoriteId, who)
        : await addFavorite(userId, favoriteId, who)

      // Обновляем состояние на серверную версию (на случай, если сервер вернул другие данные)
      // Это обеспечивает синхронизацию, если избранное было изменено с другого устройства
      if (who === "doctor") {
        set({ favoriteDoctors: serverFavorites })
      } else {
        set({ favoriteClinics: serverFavorites })
      }

      // Обновляем профиль в useUserStore, чтобы синхронизировать изменения
      // Подписка автоматически обновит catalogStore, если значения отличаются
      const currentProfile = useUserStore.getState().profile
      if (currentProfile && currentProfile.role === USER_ROLES.PATIENT) {
        const updatedProfile = {
          ...currentProfile,
          favoriteDoctors: who === "doctor" ? serverFavorites : (currentProfile as PatientProfile).favoriteDoctors || [],
          favoriteClinics: who === "clinic" ? serverFavorites : (currentProfile as PatientProfile).favoriteClinics || [],
        } as PatientProfile
        useUserStore.getState().setProfile(updatedProfile)
      }

      logger.info(`Синхронизация избранного для ${who} завершена успешно`, {
        userId,
        favoriteId,
      })
    } catch (error) {
      // Откат изменений при ошибке (rollback)
      if (who === "doctor") {
        set({ favoriteDoctors: currentFavorites })
      } else {
        set({ favoriteClinics: currentFavorites })
      }

      logger.error(
        `Ошибка при синхронизации избранного для ${who}, изменения откатены`,
        error instanceof Error ? error : new Error(String(error)),
        {
          userId,
          favoriteId,
        },
      )

      toast.error("Не удалось сохранить изменения в избранном. Попробуйте еще раз.")
    }
  },

  clearFilters: () => {
    set({
      doctorFilters: DEFAULT_DOCTOR_SEARCH_PARAMS,
      clinicFilters: DEFAULT_CLINIC_SEARCH_PARAMS,
    })

    logger.info("Фильтры очищены")
  },

  reset: () => {
    set({
      ...initialState,
    })

    logger.info("Состояние каталога сброшено")
  },
}))

// Подписка на изменения profile.favoriteDoctors и profile.favoriteClinics
// Синхронизирует избранное в catalog store при изменении профиля
let previousProfile: RoleProfile | null = null
let previousFavorites: { favoriteDoctors: string[]; favoriteClinics: string[] } | null = null

useUserStore.subscribe((state) => {
  const profile = state.profile
  
  // Проверяем, изменился ли профиль
  if (profile === previousProfile) return
  
  previousProfile = profile
  
  if (profile && profile.role === USER_ROLES.PATIENT) {
    const patientProfile = profile as PatientProfile
    const newFavorites = {
      favoriteDoctors: patientProfile.favoriteDoctors || [],
      favoriteClinics: patientProfile.favoriteClinics || [],
    }
    
    // Проверяем, действительно ли изменилось избранное
    const favoritesChanged =
      !previousFavorites ||
      JSON.stringify(newFavorites.favoriteDoctors) !== JSON.stringify(previousFavorites.favoriteDoctors) ||
      JSON.stringify(newFavorites.favoriteClinics) !== JSON.stringify(previousFavorites.favoriteClinics)
    
    if (favoritesChanged) {
      previousFavorites = newFavorites
      useCatalogStore.getState().syncFavoritesFromProfile(newFavorites)
    }
  } else {
    // Если профиль не загружен или пользователь не пациент, очищаем избранное
    const catalogStore = useCatalogStore.getState()
    if (catalogStore.favoriteDoctors.length > 0 || catalogStore.favoriteClinics.length > 0) {
      previousFavorites = { favoriteDoctors: [], favoriteClinics: [] }
      catalogStore.syncFavoritesFromProfile({
        favoriteDoctors: [],
        favoriteClinics: [],
      })
    }
  }
})
