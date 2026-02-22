import { FileText, Check, ShieldCheck, User, Building2, X } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import type { UserRole } from "@/entities/user/types/user.types"
import { USER_ROLES } from "@/entities/user/model/user.constants"

interface Props {
  userRole: UserRole
  onAccept: () => void
  onDecline: () => void
  onShowPrivacyModal: () => void
}

export function ConsentModal({ userRole, onAccept, onDecline, onShowPrivacyModal }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onDecline()}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Согласие на обработку данных</DialogTitle>
              <DialogDescription>В соответствии с 152-ФЗ</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-global p-6">
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4">
              <div className="flex gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
                <div>
                  <p className="mb-1 font-medium text-purple-900">Обработка персональных данных</p>
                  <p className="text-sm text-purple-800">
                    Я даю согласие на обработку моих персональных данных для целей регистрации в
                    системе и предоставления услуг платформы.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-child">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <User className="h-4 w-4 text-gray-500" />
                Какие данные обрабатываются
              </h4>
              <div className="space-child rounded-lg bg-gray-100 p-4">
                <div className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-700">
                    ФИО, контактные данные (email, телефон)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-700">Пароль в зашифрованном виде</span>
                </div>
                {userRole === USER_ROLES.DOCTOR && (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span className="text-sm text-gray-700">
                        Профессиональные данные (специализация, опыт, образование)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span className="text-sm text-gray-700">
                        Документы (диплом, лицензия, сертификаты)
                      </span>
                    </div>
                  </>
                )}
                {userRole === USER_ROLES.CLINIC && (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span className="text-sm text-gray-700">
                        Данные организации (ИНН, ОГРН, адрес)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      <span className="text-sm text-gray-700">
                        Документы клиники (лицензии, уставные документы)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-child">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                <Building2 className="h-4 w-4 text-gray-500" />
                Цели обработки
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Регистрация и аутентификация",
                  "Доступ к сервису",
                  "Безопасность данных",
                  "Модерация аккаунтов",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2"
                  >
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Информация о защите */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Защита данных:</strong> Ваши данные защищены в соответствии с
                законодательством РФ. Мы не передаём данные третьим лицам без вашего согласия.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 border-t bg-gray-50/50 p-6 pt-4 sm:flex-col">
          <div className="flex w-full gap-3">
            <Button variant="secondary" className="flex-1" onClick={onDecline}>
              <X className="h-4 w-4" />
              Отказаться
            </Button>
            <Button className="flex-1" onClick={onAccept}>
              <Check className="h-4 w-4" />
              Принять согласие
            </Button>
          </div>
          <button
            onClick={onShowPrivacyModal}
            className="text-sm text-purple-600 transition-colors hover:text-purple-700 hover:underline"
          >
            Подробная политика конфиденциальности →
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
