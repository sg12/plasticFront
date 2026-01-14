import type { CatalogClinic, CatalogDoctor, CatalogTab, ClinicSearchParams, DoctorSearchParams } from "@/entities/catalog/types/types"
import type { UseSearchReturn } from "@/features/search/hooks/useSearch"

export interface UseCatalogReturn {
  /** Поиск врачей */
  doctorSearch: UseSearchReturn<DoctorSearchParams, CatalogDoctor>
  /** Поиск клиник */   
  clinicSearch: UseSearchReturn<ClinicSearchParams, CatalogClinic>
  /** Активная вкладка */
  activeTab: CatalogTab
  /** Установить активную вкладку */
  setActiveTab: (tab: CatalogTab) => void
  /** Показывать ли вкладку врачей */
  showDoctors: boolean
  /** Показывать ли вкладку клиник */
  showClinics: boolean
  /** Текущий поисковый запрос в зависимости от активной вкладки */
  currentSearchQuery: string
  /** Установить поисковый запрос для активной вкладки */
  setCurrentSearchQuery: (query: string) => void
  /** Плейсхолдер для поиска в зависимости от активной вкладки */
  searchPlaceholder: string
}
