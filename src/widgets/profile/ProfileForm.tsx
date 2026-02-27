import { Edit2, Loader, Save, X } from "lucide-react"
import { Button } from "../../shared/ui/button"
import { useProfile } from "@/features/user-management/profile/edit/hooks/useProfile"
import { UserProfileCard } from "@/widgets/profile/UserProfileCard"
import { UserProfileInformation } from "@/widgets/profile/UserProfileInformation"
import { UserProfileHistory } from "@/widgets/profile/UserProfileHistory"
import { Card, CardContent } from "@/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { UserProfileFiles } from "./UserProfileFiles"

/**
 * Компонент для просмотра своего профиля
 */

export const ProfileForm = () => {
  const {
    user,
    isEditing,
    form,
    isSaving,
    startEdit,
    cancelEdit,
    onSubmit,
    FormProvider,
  } = useProfile()

  return (
    <FormProvider {...form}>
      <Card>
        <form onSubmit={onSubmit} className="space-global pb-10 sm:pb-0">
          <CardContent className="space-child">
            <div className="flex justify-between max-md:justify-center items-start">
              <UserProfileCard user={user!} />
              <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
                {!isEditing ? (
                  <Button onClick={startEdit} variant="secondary">
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button onClick={onSubmit} variant="primary" disabled={isSaving}>
                      Сохранить
                    </Button>
                    <Button variant="secondary" disabled={isSaving} onClick={cancelEdit}>
                      Отмена
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Tabs defaultValue="information">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="information">Данные</TabsTrigger>
                <TabsTrigger value="files">Файлы</TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
              </TabsList>
              <TabsContent value="information">
                <UserProfileInformation
                  form={form}
                  user={user!}
                  isEditing={isEditing}
                  isSaving={isSaving}
                />
              </TabsContent>
              <TabsContent value="files">
                <UserProfileFiles />
              </TabsContent>
              <TabsContent value="history">
                <UserProfileHistory user={user!} />
              </TabsContent>
            </Tabs>
          </CardContent>

          <div className="bg-background/90 h-[calc(100svh-var(--header-height))]!] fixed inset-x-0 bottom-(--header-height) bottom-0 z-10 border-t p-3 backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-1">
              {!isEditing ? (
                <Button onClick={startEdit} className="flex-1" size="sm" variant="secondary">
                  <Edit2 className="h-4 w-4" />
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onSubmit}
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
                    variant="secondary"
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
        </form>
      </Card>
    </FormProvider >
  )
}
