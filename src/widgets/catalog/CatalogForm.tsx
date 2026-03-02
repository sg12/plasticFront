/**
 * @fileoverview Главный компонент каталога
 */

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Building2, Heart, Stethoscope } from "lucide-react"

import { FavoritesList } from "./FavoritesList"
import { CatalogSearch } from "@/features/user-management/catalog/ui/CatalogSearch"
import { EntityList } from "@/shared/ui/entityList"

import { useCatalog } from "@/entities/catalog/api/catalog.queries"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import type { Clinic, Doctor } from "@/entities/user/types/user.types"
import { UserCard } from "./UserCard"

export const CatalogForm = () => {
  const [activeTab, setActiveTab] = useState("doctor")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: doctors = [], isLoading: doctorsLoading, error: doctorsError, refetch: doctorsRefetch } = useCatalog<Doctor>({
    role: USER_ROLE.DOCTOR,
    search: searchQuery,
    take: 20,
    skip: 0,
  })

  const { data: clinics = [], isLoading: clinicsLoading, error: clinicsError, refetch: clinicsRefetch } = useCatalog<Clinic>({
    role: USER_ROLE.CLINIC,
    search: searchQuery,
    take: 20,
    skip: 0,
  })

  const currentLoading = activeTab === "favorites"
    ? doctorsLoading || clinicsLoading
    : (activeTab === "doctors" ? doctorsLoading : clinicsLoading)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-global">
      <CatalogSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск по названию или имени..."
        isLoading={currentLoading}
      />

      <TabsList className="max-lg:w-full">
        <TabsTrigger value="doctor">
          <Stethoscope className="h-4 w-4" />
          Врачи
        </TabsTrigger>
        <TabsTrigger value="clinic">
          <Building2 className="h-4 w-4" />
          Клиники
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-2">
          <Heart className="h-4 w-4" />
          Избранные
        </TabsTrigger>
      </TabsList>

      <TabsContent value="doctor" className="outline-none">
        <EntityList
          entities={doctors}
          renderItem={(doctor: Doctor) => <UserCard user={doctor} role={USER_ROLE.DOCTOR} />}
          isLoading={doctorsLoading}
          error={doctorsError}
          emptyMessage="Врачи не найдены"
          onRetry={doctorsRefetch}
          onClearSearch={() => setSearchQuery("")}
          hasSearchQuery={!!searchQuery}
        />
      </TabsContent>

      <TabsContent value="clinic" className="outline-none">
        <EntityList
          entities={clinics}
          renderItem={(clinic: Clinic) => <UserCard user={clinic} role={USER_ROLE.CLINIC} />}
          isLoading={clinicsLoading}
          error={clinicsError}
          emptyMessage="Врачи не найдены"
          onRetry={clinicsRefetch}
          onClearSearch={() => setSearchQuery("")}
          hasSearchQuery={!!searchQuery}
        />
      </TabsContent>

      <TabsContent value="favorites" className="outline-none">
        <FavoritesList
          doctors={doctors || []}
          clinics={clinics || []}
          isLoading={doctorsLoading || clinicsLoading}
          error={doctorsError || clinicsError}
        />
      </TabsContent>
    </Tabs >
  )
}