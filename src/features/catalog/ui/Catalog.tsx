/**
 * @fileoverview Главный компонент каталога
 *
 * Объединяет поиск, фильтры, табы и списки врачей/клиник.
 * Управляет переключением между вкладками "Врачи" и "Клиники".
 *
 * @module features/catalog/ui/Catalog
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { DoctorList } from "./DoctorList"
import { ClinicList } from "./ClinicList"
import { CatalogSearch } from "./CatalogSearch"
import type { CatalogTab } from "@/entities/catalog/types/types"
import { FavoritesList } from "@/features/catalog/ui/FavoritesList"
import { useCatalog } from "../hooks/useCatalog"
import { Building, Building2, Heart, Stethoscope } from "lucide-react"

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

  return (
    <div className="space-global">
      <div>
        <h2>Каталог</h2>
        <p className="mt-2 text-gray-600">Найдите подходящего специалиста или клинику</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CatalogTab)}>
        <div className="space-y-4">
          {
            <CatalogSearch
              value={currentSearchQuery}
              onChange={(value) => setCurrentSearchQuery(value)}
              placeholder={searchPlaceholder}
            />
          }

          {showDoctors && showClinics && (
            <TabsList className="max-lg:w-full">
              {showDoctors && (
                <TabsTrigger value="doctors">
                  <Stethoscope /> Врачи
                </TabsTrigger>
              )}
              {showClinics && (
                <TabsTrigger value="clinics">
                  <Building2 /> Клиники
                </TabsTrigger>
              )}
              <TabsTrigger value="favorites">
                <Heart /> Избранные
              </TabsTrigger>
            </TabsList>
          )}

          {showDoctors && (
            <TabsContent value="doctors">
              <DoctorList
                doctors={doctorSearch.data || []}
                isLoading={doctorSearch.isLoading}
                error={doctorSearch.error}
              />
            </TabsContent>
          )}

          {showClinics && (
            <TabsContent value="clinics">
              <ClinicList
                clinics={clinicSearch.data || []}
                isLoading={clinicSearch.isLoading}
                error={clinicSearch.error}
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
