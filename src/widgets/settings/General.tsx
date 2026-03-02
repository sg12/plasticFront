import { Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

export const General = () => {
  // TODO: Звуковой сигнал уведомление
  // TODO: Push-уведомление (вкл/выкл)
  // TODO: Email-уведомление (вкл/выкл)
  return (
    <div className="space-global">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Регион и часовой пояс
          </CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  )
}
