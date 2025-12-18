import { X, Shield, Lock, Eye, Database } from "lucide-react";
import type { PrivacyModalProps } from "../types/types";

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Политика конфиденциальности
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-gray-700">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Защита ваших данных
                  </h4>
                  <p className="text-gray-700">
                    Мы серьезно относимся к защите ваших персональных данных и
                    соблюдаем все требования Федерального закона № 152-ФЗ "О
                    персональных данных".
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-6 h-6 text-purple-600" />
                Какие данные мы собираем
              </h4>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">
                  Обязательные данные:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>ФИО, email, номер телефона</li>
                  <li>Пароль (хранится в зашифрованном виде)</li>
                  <li>Тип аккаунта (пациент/врач/клиника)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Для врачей:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Специализация, опыт работы, образование</li>
                  <li>Номер медицинской лицензии</li>
                  <li>Скан-копии дипломов и сертификатов</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Для клиник:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Юридические данные организации</li>
                  <li>Медицинская лицензия клиники</li>
                  <li>Уставные документы</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-green-600" />
                Как мы защищаем ваши данные
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">
                    Шифрование
                  </h5>
                  <p className="text-sm text-green-800">
                    Все данные передаются по защищенным каналам HTTPS и хранятся
                    в зашифрованном виде.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">Доступ</h5>
                  <p className="text-sm text-green-800">
                    Доступ к данным имеют только авторизованные сотрудники и
                    только при необходимости.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">
                    Резервное копирование
                  </h5>
                  <p className="text-sm text-green-800">
                    Регулярное резервное копирование данных с соблюдением мер
                    безопасности.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">
                    Мониторинг
                  </h5>
                  <p className="text-sm text-green-800">
                    Постоянный мониторинг системы на предмет попыток
                    несанкционированного доступа.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                Как мы используем ваши данные
              </h4>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>
                    <strong>Регистрация и аутентификация:</strong> Для создания
                    и поддержания вашего аккаунта
                  </li>
                  <li>
                    <strong>Предоставление услуг:</strong> Для обеспечения
                    доступа к функционалу платформы
                  </li>
                  <li>
                    <strong>Модерация:</strong> Для проверки аккаунтов врачей и
                    клиник
                  </li>
                  <li>
                    <strong>Безопасность:</strong> Для предотвращения
                    мошенничества и нарушений
                  </li>
                  <li>
                    <strong>Улучшение сервиса:</strong> Для анализа
                    использования и улучшения платформы
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-yellow-900 mb-3">
                Важная информация
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>
                  • Мы не передаем ваши данные третьим лицам без вашего явного
                  согласия
                </li>
                <li>
                  • Вы можете в любой момент запросить удаление своих данных
                </li>
                <li>
                  • Мы храним данные только в течение времени, необходимого для
                  предоставления услуг
                </li>
                <li>• При изменении политики мы уведомим вас заранее</li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 text-center">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Понятно, закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
