/**
 * @fileoverview Общий хук для работы с каталогом
 *
 * Объединяет логику поиска врачей и клиник, управление вкладками
 * и определение доступных разделов в зависимости от роли пользователя.
 *
 * @module features/catalog/hooks/useCatalog
 */

import { useEffect, useState } from "react"
import { useSearch } from "../../search/hooks/useSearch"
import { useCatalogStore } from "@/entities/catalog/model/catalog.store"
import { USER_ROLES } from "@/entities/user/model/user.constants"
import {
  DEFAULT_CLINIC_SEARCH_PARAMS,
  DEFAULT_DOCTOR_SEARCH_PARAMS,
} from "@/entities/catalog/model/catalog.constants"
import type {
  CatalogClinic,
  CatalogDoctor,
  CatalogTab,
  ClinicSearchParams,
  DoctorSearchParams,
} from "@/entities/catalog/types/catalog.types"
import { useUserStore } from "@/entities/user/model/user.store"
import type { UseCatalogReturn } from "../types/types"
import { useDoctors } from "./useDoctors"
import { useClinics } from "./useClinics"

/**
 * Хук для работы с каталогом
 *
 * Объединяет логику поиска врачей и клиник, управляет вкладками
 * и определяет доступные разделы в зависимости от роли пользователя.
 *
 * @returns Объект с данными поиска, состоянием вкладок и методами управления
 *
 */
export const useCatalog = (): UseCatalogReturn => {
  const { profile } = useUserStore()
  const { clinicFilters, doctorFilters } = useCatalogStore()
  const userRole = profile?.role

  // Определяем, какие вкладки показывать в зависимости от роли
  const showDoctors = userRole === USER_ROLES.PATIENT || userRole === USER_ROLES.CLINIC
  const showClinics = userRole === USER_ROLES.PATIENT || userRole === USER_ROLES.DOCTOR

  // Определяем начальную вкладку
  const [activeTab, setActiveTab] = useState<CatalogTab>(showDoctors ? "doctors" : "clinics")

  // Хук поиска врачей
  const doctorSearch = useSearch<DoctorSearchParams, CatalogDoctor>(doctorFilters, {
    useDataHook: useDoctors,
    storeFilters: doctorFilters,
    defaultParams: DEFAULT_DOCTOR_SEARCH_PARAMS,
    dataFieldName: "doctors",
  })

  // Хук поиска клиник
  const clinicSearch = useSearch<ClinicSearchParams, CatalogClinic>(clinicFilters, {
    useDataHook: useClinics,
    storeFilters: clinicFilters,
    defaultParams: DEFAULT_CLINIC_SEARCH_PARAMS,
    dataFieldName: "clinics",
  })

  // Автоматически выполняем поиск при монтировании компонента
  useEffect(() => {
    if (showDoctors) {
      doctorSearch.executeSearch({})
    }
    if (showClinics) {
      clinicSearch.executeSearch({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDoctors, showClinics])

  // Вычисляемые значения для удобства использования
  const currentSearchQuery =
    activeTab === "doctors" ? doctorSearch.searchQuery : clinicSearch.searchQuery

  const setCurrentSearchQuery = (query: string) => {
    if (activeTab === "doctors") {
      doctorSearch.setSearchQuery(query)
    } else if (activeTab === "clinics") {
      clinicSearch.setSearchQuery(query)
    } else {
      doctorSearch.setSearchQuery(query)
      clinicSearch.setSearchQuery(query)
    }
  }

  const searchPlaceholder =
    activeTab === "doctors"
      ? "Поиск врачей по имени, фамилию или отчеству..."
      : activeTab === "clinics"
        ? "Поиск клиник по названию..."
        : "Поиск врачей или клиник..."

  return {
    doctorSearch,
    clinicSearch,
    activeTab,
    setActiveTab,
    showDoctors,
    showClinics,
    currentSearchQuery,
    setCurrentSearchQuery,
    searchPlaceholder,
  }
}
