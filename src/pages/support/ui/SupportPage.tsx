import { SupportForm } from "@/widgets/support/SupportForm"
import { SupportReplies } from "@/widgets/support/SupportReplies"

export const SupportPage = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Поддержка</h3>
          <p className="text-muted-foreground mt-2">Свяжитесь с нами для получения помощи</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SupportForm />

        <div>
          <SupportReplies />
        </div>
      </div>
    </div>
  )
}
