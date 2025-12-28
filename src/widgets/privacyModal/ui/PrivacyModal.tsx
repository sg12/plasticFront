import { Shield, Lock, Eye, Database, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import type { PrivacyModalProps } from "../types/types"

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Политика конфиденциальности</DialogTitle>
              <DialogDescription>
                Федеральный закон № 152-ФЗ "О персональных данных"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto">
          <div className="space-y-6 p-6">
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-purple-50/50 to-blue-50 p-5">
              <div className="flex gap-4">
                <Shield className="h-8 w-8 shrink-0 text-purple-600" />
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Защита ваших данных</h4>
                  <p className="text-sm text-gray-700">
                    Мы серьёзно относимся к защите персональных данных и соблюдаем все требования
                    законодательства РФ.
                  </p>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <Database className="h-5 w-5 text-purple-600" />
                Какие данные мы собираем
              </h4>

              <div className="grid gap-3">
                <DataBlock title="Обязательные данные" variant="default">
                  <DataItem>ФИО, email, номер телефона</DataItem>
                  <DataItem>Пароль (хранится в зашифрованном виде)</DataItem>
                  <DataItem>Тип аккаунта (пациент / врач / клиника)</DataItem>
                </DataBlock>

                <DataBlock title="Для врачей" variant="purple">
                  <DataItem>Специализация, опыт работы, образование</DataItem>
                  <DataItem>Номер медицинской лицензии</DataItem>
                  <DataItem>Скан-копии дипломов и сертификатов</DataItem>
                </DataBlock>

                <DataBlock title="Для клиник" variant="purple">
                  <DataItem>Юридические данные организации</DataItem>
                  <DataItem>Медицинская лицензия клиники</DataItem>
                  <DataItem>Уставные документы</DataItem>
                </DataBlock>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <Lock className="h-5 w-5 text-green-600" />
                Как мы защищаем ваши данные
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <SecurityCard icon={Lock} title="Шифрование">
                  Все данные передаются по HTTPS и хранятся в зашифрованном виде
                </SecurityCard>
                <SecurityCard icon={Eye} title="Контроль доступа">
                  Доступ только у авторизованных сотрудников при необходимости
                </SecurityCard>
                <SecurityCard icon={Database} title="Резервное копирование">
                  Регулярные бэкапы с соблюдением мер безопасности
                </SecurityCard>
                <SecurityCard icon={Shield} title="Мониторинг">
                  Постоянный мониторинг на предмет несанкционированного доступа
                </SecurityCard>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <Eye className="h-5 w-5 text-blue-600" />
                Как мы используем ваши данные
              </h4>

              <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <UsageItem title="Регистрация">Создание и поддержание вашего аккаунта</UsageItem>
                <UsageItem title="Услуги">Обеспечение доступа к функционалу платформы</UsageItem>
                <UsageItem title="Модерация">Проверка аккаунтов врачей и клиник</UsageItem>
                <UsageItem title="Безопасность">Предотвращение мошенничества</UsageItem>
                <UsageItem title="Улучшение">Анализ и улучшение сервиса</UsageItem>
              </div>
            </section>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-900">Важная информация</h4>
                  <ul className="space-y-1.5 text-sm text-amber-800">
                    <li>• Мы не передаём данные третьим лицам без вашего согласия</li>
                    <li>• Вы можете запросить удаление данных в любой момент</li>
                    <li>• Данные хранятся только необходимое время</li>
                    <li>• При изменении политики мы уведомим вас заранее</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-gray-50/50 p-6 pt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            <CheckCircle className="h-4 w-4" />
            Понятно, закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DataBlock({
  title,
  variant,
  children,
}: {
  title: string
  variant: "default" | "purple"
  children: React.ReactNode
}) {
  const styles = {
    default: "bg-gray-50 border-gray-200",
    purple: "bg-purple-50/50 border-purple-200",
  }

  return (
    <div className={`rounded-lg border p-4 ${styles[variant]}`}>
      <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function DataItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  )
}

function SecurityCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-green-600" />
        <h5 className="font-medium text-green-900">{title}</h5>
      </div>
      <p className="text-sm text-green-800">{children}</p>
    </div>
  )
}

function UsageItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-blue-800">
        <strong>{title}:</strong> {children}
      </span>
    </div>
  )
}
