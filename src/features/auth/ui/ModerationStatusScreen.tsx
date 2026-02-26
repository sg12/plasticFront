import { useLogout } from "@/entities/auth/api/auth.queries"
import { MODERATION_STATUS, MODERATION_STATUS_LOCALES } from "@/entities/user/model/user.constants"
import { Button } from "@/shared/ui/button"
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/shared/ui/card"

export const ModerationStatusScreen = ({ status, comment }: { status: keyof typeof MODERATION_STATUS, comment: string }) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  const config = {
    [MODERATION_STATUS.REJECTED]: {
      title: MODERATION_STATUS_LOCALES["REJECTED"].ru,
      description: "К сожалению, ваш профиль не прошел модерацию. Проверьте причину ниже или обратитесь в поддержку.",
    },
    [MODERATION_STATUS.PENDING]: {
      title: MODERATION_STATUS_LOCALES["PENDING"].ru,
      description: "Ваша заявка находится в очереди на проверку. Обычно это занимает не более 24 часов.",
    },
    [MODERATION_STATUS.BANNED]: {
      title: MODERATION_STATUS_LOCALES["BANNED"]?.ru || "Аккаунт заблокирован",
      description: "Ваш доступ к платформе ограничен администрацией из-за нарушения правил сообщества.",
    }
  }

  const current = config[status as keyof typeof config]

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <Card className="w-full max-w-xl max-md:h-full max-md:w-full max-md:border-0">
        <CardHeader>
          <CardTitle>
            {current.title}</CardTitle>
          <CardDescription>
            {current.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-child">
          {comment && (
            <div className="mb-8 w-full rounded-lg border border-red-100 bg-red-50/50 p-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                Комментарий администратора:
              </span>
              <p className="mt-1 text-sm text-red-700 italic">
                «{comment}»
              </p>
            </div>
          )}

          <div className="flex w-full flex-col gap-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => logout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Выходим..." : "Выйти из системы"}
            </Button>
          </div>
        </CardContent >
      </Card>
    </div >
  )
}