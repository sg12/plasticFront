/**
 * @fileoverview Главный компонент каталога
 *
 * Объединяет поиск, фильтры, табы и списки врачей/клиник.
 * Управляет переключением между вкладками "Врачи" и "Клиники".
 *
 * @module features/catalog/ui/Catalog
 */

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useDoctorSearch } from "../hooks/useDoctorSearch"
import { useClinicSearch } from "../hooks/useClinicSearch"
import { DoctorList } from "./DoctorList"
import { ClinicList } from "./ClinicList"
import { CatalogSearch } from "./CatalogSearch"
import { useAuthStore } from "@/entities/auth/model/store"
import { USER_ROLES } from "@/entities/user/model/constants"
import type { CatalogTab } from "../../../entities/catalog/types/types"
import { FavoritesList } from "@/features/catalog/ui/FavoritesList"

export const Catalog = () => {
  const { profile } = useAuthStore()
  const userRole = profile?.role
  const showDoctors = userRole === USER_ROLES.PATIENT || userRole === USER_ROLES.CLINIC
  const showClinics = userRole === USER_ROLES.PATIENT || userRole === USER_ROLES.DOCTOR

  const [activeTab, setActiveTab] = useState<CatalogTab>(showDoctors ? "doctors" : "clinics")

  const doctorSearch = useDoctorSearch()
  const clinicSearch = useClinicSearch()

  useEffect(() => {
    if (showDoctors) {
      doctorSearch.executeSearch({})
    }
    if (showClinics) {
      clinicSearch.executeSearch({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDoctors, showClinics])

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
              value={activeTab === "doctors" ? doctorSearch.searchQuery : clinicSearch.searchQuery}
              onChange={
                activeTab === "doctors" ? doctorSearch.setSearchQuery : clinicSearch.setSearchQuery
              }
              placeholder={
                activeTab === "doctors"
                  ? "Поиск врачей по имени, фамилию или отчеству..."
                  : activeTab === "clinics"
                    ? "Поиск клиник по названию..."
                    : "Поиск врачей или клиник..."
              }
            />
          }

          {showDoctors && showClinics && (
            <TabsList className="max-lg:w-full">
              {showDoctors && <TabsTrigger value="doctors">Врачи</TabsTrigger>}
              {showClinics && <TabsTrigger value="clinics">Клиники</TabsTrigger>}
              <TabsTrigger value="favorites">Избранные</TabsTrigger>
            </TabsList>
          )}

          {showDoctors && (
            <TabsContent value="doctors">
              <DoctorList
                doctors={doctorSearch.doctors || []}
                isLoading={doctorSearch.isLoading}
                error={doctorSearch.error}
              />
            </TabsContent>
          )}

          {showClinics && (
            <TabsContent value="clinics">
              <ClinicList
                clinics={clinicSearch.clinics || []}
                isLoading={clinicSearch.isLoading}
                error={clinicSearch.error}
              />
            </TabsContent>
          )}

          <TabsContent value="favorites">
            <FavoritesList
              doctors={doctorSearch.doctors || []}
              clinics={clinicSearch.clinics || []}
              isLoading={doctorSearch.isLoading || clinicSearch.isLoading}
              error={doctorSearch.error || clinicSearch.error}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
