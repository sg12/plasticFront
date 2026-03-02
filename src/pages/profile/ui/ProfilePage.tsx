import { useParams } from "react-router"
import { ProfileForm } from "@/widgets/profile/ProfileForm"
import { ViewProfileForm } from "@/widgets/profile/ViewProfileForm"
import { useMe } from "@/entities/user/api/user.queries"

/**
 * Компонент профиля (Может показать свой и чужой профиль)
 * - Если userId в URL совпадает с текущим пользователем или отсутствует - показываем свой профиль (с редактированием)
 * - Если userId в URL отличается - показываем чужой профиль (только просмотр)
 */
export const ProfilePage = () => {
  const { userId } = useParams<{ userId?: string }>()
  const { data: user } = useMe()

  const isOwnProfile = !userId || userId === user?.id

  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">{isOwnProfile ? "Профиль" : "Просмотр профиля"}</h3>
          <p className="text-muted-foreground mt-2">{isOwnProfile ? "Здесь вы можете редактировать свои данные" : "Здесь вы можете просмотреть профиль другого пользователя"}</p>
        </div>
      </div>
      {isOwnProfile ? <ProfileForm /> : <ViewProfileForm userId={userId} />}
    </div>
  )
}
