/**
 * @fileoverview Главный компонент каталога
 *
 * Объединяет поиск, фильтры, табы и списки врачей/клиник.
 * Управляет переключением между вкладками "Врачи" и "Клиники".
 *
 * @module features/catalog/ui/Catalog
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { CatalogSearch } from "./CatalogSearch"
import type { CatalogTab } from "@/entities/catalog/types/types"
import { FavoritesList } from "@/features/catalog/ui/FavoritesList"
import { useCatalog } from "../hooks/useCatalog"
import { Building2, Heart, Stethoscope } from "lucide-react"
import { EntityList } from "./EntityList"

export const Catalog = () => {
  const {
    doctorSearch,
    clinicSearch,
    activeTab,
    setActiveTab,
    showDoctors,
    showClinics,
    currentSearchQuery,
    setCurrentSearchQuery,
    searchPlaceholder,
  } = useCatalog()

  const getResultsCount = () => {
    if (activeTab === "doctors") {
      return doctorSearch.data?.length || 0
    }
    if (activeTab === "clinics") {
      return clinicSearch.data?.length || 0
    }
    return 0
  }

  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="min-w-0 truncate">Каталог</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Найдите подходящего специалиста или клинику
          </p>
        </div>
        {!doctorSearch.isLoading && !clinicSearch.isLoading && currentSearchQuery && (
          <div className="text-muted-foreground text-sm">
            Найдено: <span className="font-semibold text-foreground">{getResultsCount()}</span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CatalogTab)}>
        <div className="space-y-4">
          <CatalogSearch
            value={currentSearchQuery}
            onChange={(value) => setCurrentSearchQuery(value)}
            placeholder={searchPlaceholder}
          />
          {showDoctors && showClinics && (
            <TabsList className="max-lg:w-full">
              {showDoctors && (
                <TabsTrigger value="doctors" className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Врачи
                </TabsTrigger>
              )}
              {showClinics && (
                <TabsTrigger value="clinics" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Клиники
                </TabsTrigger>
              )}
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4" />
                Избранные
              </TabsTrigger>
            </TabsList>
          )}
          {showDoctors && (
            <TabsContent value="doctors">
              <EntityList
                entities={doctorSearch.data || []}
                isLoading={doctorSearch.isLoading}
                error={doctorSearch.error}
                emptyMessage="Врачи не найдены"
                descriptionMessage={
                  currentSearchQuery
                    ? "Попробуйте изменить параметры поиска"
                    : "В каталоге пока нет врачей"
                }
              />
            </TabsContent>
          )}
          {showClinics && (
            <TabsContent value="clinics">
              <EntityList
                entities={clinicSearch.data || []}
                isLoading={clinicSearch.isLoading}
                error={clinicSearch.error}
                emptyMessage="Клиники не найдены"
                descriptionMessage={
                  currentSearchQuery
                    ? "Попробуйте изменить параметры поиска"
                    : "В каталоге пока нет клиник"
                }
              />
            </TabsContent>
          )}
          <TabsContent value="favorites">
            <FavoritesList
              doctors={doctorSearch.data || []}
              clinics={clinicSearch.data || []}
              isLoading={doctorSearch.isLoading || clinicSearch.isLoading}
              error={doctorSearch.error || clinicSearch.error}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
