import { PersonalData } from "@/widgets/settings/personalData/ui/PersonalData"

export const PersonalDataPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Персональные данные</h3>
          <p className="text-muted-foreground mt-2"> В соответствии с 152-ФЗ "О персональных данных"</p>
        </div>
      </div>
      <PersonalData />
    </div>
  )
}
