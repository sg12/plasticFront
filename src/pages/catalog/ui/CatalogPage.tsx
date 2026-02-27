import { CatalogForm } from "@/features/user-management/catalog/ui/CatalogForm"

export const CatalogPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Каталог</h3>
          <p className="text-muted-foreground mt-2">Найдите подходящего специалиста или клинику</p>
        </div>
      </div>
      <CatalogForm />
    </div>
  )
}
