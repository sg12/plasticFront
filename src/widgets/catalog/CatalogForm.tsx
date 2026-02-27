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
import { useCatalog } from "../hooks/useCatalog"
import { Building2, Heart, Stethoscope } from "lucide-react"
import { EntityList } from "./EntityList"
import { FavoritesList } from "./FavoritesList"

export const CatalogForm = () => {
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
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
      <div className="space-y-4">
        <CatalogSearch
          value={currentSearchQuery}
          onChange={(value) => setCurrentSearchQuery(value)}
          placeholder={searchPlaceholder}
          isLoading={
            activeTab === "doctors"
              ? doctorSearch.isLoading
              : activeTab === "clinics"
                ? clinicSearch.isLoading
                : doctorSearch.isLoading || clinicSearch.isLoading
          }
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
              emptyMessage={
                currentSearchQuery ? "Врачи не найдены" : "В каталоге пока нет врачей"
              }
              descriptionMessage={
                currentSearchQuery
                  ? "Попробуйте изменить параметры поиска или очистить фильтры"
                  : "Врачи появятся здесь после регистрации и модерации"
              }
              onRetry={() => doctorSearch.refresh()}
              onClearSearch={() => setCurrentSearchQuery("")}
              hasSearchQuery={!!currentSearchQuery}
            />
          </TabsContent>
        )}
        {showClinics && (
          <TabsContent value="clinics">
            <EntityList
              entities={clinicSearch.data || []}
              isLoading={clinicSearch.isLoading}
              error={clinicSearch.error}
              emptyMessage={
                currentSearchQuery ? "Клиники не найдены" : "В каталоге пока нет клиник"
              }
              descriptionMessage={
                currentSearchQuery
                  ? "Попробуйте изменить параметры поиска или очистить фильтры"
                  : "Клиники появятся здесь после регистрации и модерации"
              }
              onRetry={() => clinicSearch.refresh()}
              onClearSearch={() => setCurrentSearchQuery("")}
              hasSearchQuery={!!currentSearchQuery}
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
  )
}
