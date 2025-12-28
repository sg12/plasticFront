import { Edit2, Loader, Save, X } from "lucide-react"
import { Button } from "../../../shared/ui/button"
import { useProfile } from "../../../widgets/profile/hooks/useProfile"
import { UserProfileCard } from "@/widgets/profile/ui/UserProfileCard"
import { UserProfileInformation } from "@/widgets/profile/ui/UserProfileInformation"
import { UserProfileHistory } from "@/widgets/profile/ui/UserProfileHistory"

export const Profile = () => {
  const {
    profile,
    isEditing,
    editableProfile,
    form,
    isSaving,
    startEdit,
    cancelEdit,
    save,
    FormProvider,
  } = useProfile()

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <div>
            <h2>Мой профиль</h2>
            <p className="mt-2 text-gray-600">Управляйте вашей личной информацией</p>
          </div>
          {!isEditing ? (
            <div className="flex flex-wrap gap-2">
              <Button onClick={startEdit}>
                <Edit2 className="h-4 w-4" />
                Редактировать
              </Button>
              {/* {profile?.role === "patient" && (
                <Button onClick={() => {}}>
                  <QrCode className="h-4 w-4" />
                  QR-код
                </Button>
              )} */}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="save" disabled={isSaving} onClick={() => void save()}>
                {isSaving ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Сохранить
              </Button>
              <Button variant="cancel" disabled={isSaving} onClick={() => cancelEdit()}>
                <X className="h-4 w-4" />
                Отмена
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UserProfileCard profile={isEditing ? editableProfile : profile} />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <UserProfileInformation
              profile={isEditing ? editableProfile : profile}
              isEditing={isEditing}
            />
            <UserProfileHistory profile={profile} />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
