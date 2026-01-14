import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { ConsentStatus } from "@/features/consentManagement/ui/ConsentStatus"
import { FileText, Shield, Mail, Phone, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"

export const PersonalData = () => {
  return (
    <div className="space-global">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="min-w-0 truncate">Персональные данные</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            В соответствии с 152-ФЗ "О персональных данных"
          </p>
        </div>
      </div>

      <Alert variant="info" className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertTitle>Ваши права защищены законом</AlertTitle>
        <AlertDescription>
          Согласно статье 14 ФЗ-152, вы имеете право на доступ к своим персональным данным, их
          исправление, удаление, а также на отзыв согласия на обработку в любое время.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Статус согласий на обработку данных
          </CardTitle>
          <CardDescription>
            Управляйте согласиями на обработку ваших персональных данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsentStatus />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Alert variant="info">
          <Shield className="h-4 w-4" />
          <AlertTitle>Как мы защищаем ваши данные</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>• Шифрование данных при передаче (SSL/TLS)</li>
              <li>• Регулярные проверки безопасности</li>
              <li>• Ограниченный доступ сотрудников к данным</li>
              <li>• Соответствие требованиям 152-ФЗ и ГОСТ</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert variant="default">
          <AlertTitle>Вопросы по персональным данным?</AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm">
            <p>Свяжитесь с ответственным за обработку персональных данных:</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>privacy@novome.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>Время ответа: в течение 30 дней согласно ст. 14 152-ФЗ</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
