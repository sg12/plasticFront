import { Edit2, Loader, Save, X } from "lucide-react"
import { Button } from "../../../shared/ui/button"
import { useProfile } from "../../../widgets/profile/hooks/useProfile"
import { UserProfileCard } from "@/widgets/profile/ui/UserProfileCard"
import { UserProfileInformation } from "@/widgets/profile/ui/UserProfileInformation"
import { UserProfileHistory } from "@/widgets/profile/ui/UserProfileHistory"
import { USER_ROLES } from "@/entities/user/model/constants"

/**
 * Компонент для просмотра своего профиля
 */

export const ProfileForm = () => {
  const {
    profile,
    isEditing,
    editableProfile,
    form,
    isSaving,
    startEdit,
    cancelEdit,
    onSubmit,
    handleSaveClick,
    FormProvider,
  } = useProfile()

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-global">
        <div className="flex flex-col justify-between lg:flex-row">
          <div>
            <h2>Мой профиль</h2>
            <p className="mt-2 text-gray-600">Управляйте вашей личной информацией</p>
          </div>
          {profile?.role != USER_ROLES.CLINIC &&
            (!isEditing ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => startEdit()}
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 max-xl:z-1 sm:relative sm:bottom-auto sm:left-auto sm:translate-x-0"
                >
                  <Edit2 className="h-4 w-4" />
                  Редактировать
                </Button>
                {/* {profile?.role === "doctor" && (
                  <Button type="button">
                  <QrCode className="h-4 w-4" />
                  QR-код
                  </Button>
                )} */}
              </div>
            ) : (
              <div className="fixed bottom-4 left-1/2 flex -translate-x-1/2 gap-2 max-xl:z-1 sm:relative sm:bottom-auto sm:left-auto sm:translate-x-0">
                <Button onClick={() => handleSaveClick()} variant="save" disabled={isSaving}>
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
            ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UserProfileCard profile={isEditing ? editableProfile : profile} />
          </div>
          <div className="space-global lg:col-span-2">
            <UserProfileInformation
              form={form}
              profile={isEditing ? editableProfile : profile}
              isEditing={isEditing}
              isSaving={isSaving}
            />
            <UserProfileHistory profile={profile} />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
