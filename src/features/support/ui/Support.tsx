import { SupportReplies } from "./SupportReplies"
import { SupportForm } from "./SupportForm"

export const Support = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold">Поддержка</h3>
          <p className="text-muted-foreground mt-2">Свяжитесь с нами для получения помощи</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-global">
          <SupportForm />
        </div>

        <div className="space-global">
          <SupportReplies />
        </div>
      </div>
    </div>
  )
}
