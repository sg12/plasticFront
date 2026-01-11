import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { ConsentStatus } from "@/features/consentManagement/ui/ConsentStatus"
import { FileText, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

export const PersonalData = () => {
  return (
    <div className="space-global">
      <div>
        <h2>Управление персональными данными</h2>
        <p className="mt-2 text-gray-600">В соответствии с 152-ФЗ "О персональных данных"</p>
      </div>
      <Alert variant="info" className="mb-6">
        <Shield />
        <AlertTitle>
          <strong>Ваши права защищены законом</strong>
        </AlertTitle>
        <AlertDescription>
          Согласно статье 14 ФЗ-152, вы имеете право на доступ к своим персональным данным, их
          исправление, удаление, а также на отзыв согласия на обработку в любое время.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Статус согласий на обработку данных
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConsentStatus />
        </CardContent>
      </Card>

      <Alert variant="info" className="mb-6">
        <AlertTitle>
          <strong>Как мы защищаем ваши данные:</strong>
        </AlertTitle>
        <AlertDescription>
          <ul className="space-text">
            <li>• Шифрование данных при передаче (SSL/TLS)</li>
            <li>• Регулярные проверки безопасности</li>
            <li>• Ограниченный доступ сотрудников к данным</li>
            <li>• Соответствие требованиям 152-ФЗ и ГОСТ</li>
          </ul>
        </AlertDescription>
      </Alert>
      <Alert variant="default" className="mb-6">
        <AlertTitle>
          <strong>Вопросы по персональным данным?</strong>
        </AlertTitle>
        <AlertDescription>
          <p>Свяжитесь с ответственным за обработку персональных данных:</p>
          <p>
            <strong>Email:</strong> privacy@novome.ru
          </p>
          <p>
            <strong>Телефон:</strong> +7 (999) 123-45-67
          </p>
          <p className="text-xs">Время ответа: в течение 30 дней согласно ст. 14 152-ФЗ</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
