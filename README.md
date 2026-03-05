# PlasticFront

Фронтенд-приложение для агрегатора медицинских услуг в сфере пластической хирургии. Проект построен на React с использованием архитектуры Feature-Sliced Design и интегрирован с Supabase для аутентификации, хранения данных.

## 🚀 Технологический стек

### Основные технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **React Router v7** - маршрутизация
- **Zustand** - управление состоянием
- **React Hook Form + Zod** - формы и валидация
- **Tailwind CSS** - стилизация

### UI компоненты

- **Radix UI** - доступные компоненты
- **Lucide React** - иконки
- **Sonner** - уведомления (toast)
- **shadcn/ui** - компонентная библиотека

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18+
- npm или yarn

### Шаги установки

1. **Клонирование репозитория**

```bash
git clone <repository-url>
cd plasticFront
```

2. **Установка зависимостей**

```bash
npm install
```

3. **Настройка переменных окружения**

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:5000/api/v1/
```

4. **Запуск dev-сервера**

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### Другие команды

```bash
# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Проверка типов TypeScript
npm run type-check

# Линтинг кода
npm run lint
```

## 📚 Дополнительная документация

- [Конвенция коммитов](./COMMIT_CONVENTION.md) - правила оформления коммитов
- [Feature-Sliced Design](https://feature-sliced.design/) - документация по архитектуре

**Версия:** 0.3.0
