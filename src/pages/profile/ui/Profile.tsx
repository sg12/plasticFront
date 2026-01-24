import { useParams } from "react-router"
import { useAuthStore } from "@/entities/auth/model/store"
import { ProfileForm } from "@/widgets/profile/ui/ProfileForm"
import { ViewProfile } from "@/widgets/profile/ui/ViewProfile"

/**
 * Компонент профиля (Может показать свой и чужой профиль)
 * - Если userId в URL совпадает с текущим пользователем или отсутствует - показываем свой профиль (с редактированием)
 * - Если userId в URL отличается - показываем чужой профиль (только просмотр)
 */
export const Profile = () => {
  const { userId } = useParams<{ userId?: string }>()
  const { user } = useAuthStore()

  const isOwnProfile = !userId || userId === user?.id

  if (!isOwnProfile && userId) {
    return <ViewProfile userId={userId} />
  }
  return <ProfileForm />
}
