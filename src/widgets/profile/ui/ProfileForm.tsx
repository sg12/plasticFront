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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="min-w-0 truncate">Профиль</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Проверьте данные и обновляйте информацию при необходимости
            </p>
          </div>

          {profile?.role != USER_ROLES.CLINIC && (
            <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
              {!isEditing ? (
                <Button onClick={startEdit} size="sm">
                  <Edit2 className="h-4 w-4" />
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveClick} variant="save" size="sm" disabled={isSaving}>
                    {isSaving ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Сохранить
                  </Button>
                  <Button variant="outline" size="sm" disabled={isSaving} onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                    Отмена
                  </Button>
                </>
              )}
            </div>
          )}
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

        {profile?.role != USER_ROLES.CLINIC && (
          <div className="bg-background/90 fixed inset-x-0 bottom-0 z-10 border-t p-3 backdrop-blur sm:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-1">
              {!isEditing ? (
                <Button onClick={startEdit} className="flex-1" size="sm">
                  <Edit2 className="h-4 w-4" />
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSaveClick}
                    variant="save"
                    size="sm"
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Сохранить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                    onClick={cancelEdit}
                    className="flex-1"
                  >
                    <X className="h-4 w-4" />
                    Отмена
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
