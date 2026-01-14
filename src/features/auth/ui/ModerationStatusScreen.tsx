import { useAuthStore } from "@/entities/auth/model/store"
import { useUserStore } from "@/entities/user/model/store"
import { Button } from "@/shared/ui/button"
import { AlertCircle, Clock } from "lucide-react"

export const ModerationStatusScreen = () => {
  const { signOut } = useAuthStore()
  const { profile } = useUserStore()
  const isRejected = profile?.moderationStatus === "rejected"
  const rejectionReason = profile?.moderationComment

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-background space-global w-full max-w-md rounded-xl border p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          {isRejected ? (
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="size-8 text-red-600" />
            </div>
          ) : (
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="size-8 text-yellow-600" />
            </div>
          )}

          <h2 className="text-xl font-semibold">
            {isRejected ? "Заявка отклонена" : "Заявка на модерации"}
          </h2>

          <p className="text-muted-foreground text-sm">
            {isRejected
              ? "К сожалению, ваши документы не прошли проверку. Пожалуйста, свяжитесь с поддержкой для уточнения деталей или повторной подачи."
              : "Мы проверяем ваши данные и документы. Обычно это занимает до 24 часов. Доступ к кабинету откроется автоматически после подтверждения."}
          </p>

          {isRejected && rejectionReason && <p>{rejectionReason}</p>}

          <div className="space-child w-full">
            {isRejected && (
              <Button className="w-full" variant="default">
                Связаться с поддержкой / Исправить
              </Button>
            )}
            <Button className="w-full" variant="outline" onClick={() => signOut("local")}>
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
