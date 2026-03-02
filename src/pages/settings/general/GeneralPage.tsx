import { General } from "@/widgets/settings/General"

export const GeneralPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Основные настройки</h3>
          <p className="text-muted-foreground mt-2">Управление параметрами аккаунта и приложения</p>
        </div>
      </div>
      <General />
    </div>
  )
}
