import { X, FileText, Check } from "lucide-react";
import type { ConsentModalProps } from "../types/types";

export function ConsentModal({
  userRole,
  onAccept,
  onDecline,
  onShowPrivacyModal,
}: ConsentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Согласие на обработку персональных данных
            </h3>
            <button
              onClick={onDecline}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-purple-900 mb-1">
                    <strong>Обработка персональных данных</strong>
                  </p>
                  <p className="text-sm text-purple-800">
                    В соответствии с Федеральным законом № 152-ФЗ "О
                    персональных данных", я даю согласие на обработку моих
                    персональных данных для целей регистрации в системе и
                    предоставления услуг.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <strong>Какие данные обрабатываются:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>ФИО, контактные данные (email, телефон)</li>
                <li>Пароль в зашифрованном виде</li>
                {userRole === "doctor" && (
                  <>
                    <li>
                      Профессиональные данные (специализация, опыт работы,
                      образование)
                    </li>
                    <li>Документы (диплом, лицензия, сертификаты)</li>
                  </>
                )}
                {userRole === "clinic" && (
                  <>
                    <li>Данные организации (ИНН, ОГРН, юридический адрес)</li>
                    <li>Документы клиники (лицензии, уставные документы)</li>
                  </>
                )}
              </ul>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <strong>Цели обработки:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Регистрация и аутентификация пользователей</li>
                <li>Предоставление доступа к сервису</li>
                <li>Обеспечение безопасности данных</li>
                <li>Модерация аккаунтов специалистов</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Политика конфиденциальности:</strong> Ваши данные
                защищены в соответствии с требованиями законодательства РФ. Мы
                не передаем данные третьим лицам без вашего согласия.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onDecline}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              Отказаться
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Принять
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={onShowPrivacyModal}
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              Подробная политика конфиденциальности
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
