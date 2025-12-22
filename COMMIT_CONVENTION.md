# Конвенция коммитов

## Формат коммита

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Типы коммитов (type)

- **feat** - новая функциональность
- **fix** - исправление бага
- **refactor** - рефакторинг кода без изменения функциональности
- **docs** - изменения в документации
- **style** - форматирование, отсутствующие точки с запятой и т.д. (не влияет на код)
- **test** - добавление/изменение тестов
- **chore** - обновление задач сборки, настройки и т.д.
- **perf** - улучшение производительности
- **ci** - изменения в CI/CD конфигурации
- **build** - изменения в системе сборки или внешних зависимостях

## Области изменений (scope)

Используются слои Feature-Sliced Design:

- **entities** - изменения в entities слое
- **features** - изменения в features слое
- **widgets** - изменения в widgets слое
- **pages** - изменения в pages слое
- **shared** - изменения в shared слое
- **app** - изменения в app слое
- **config** - изменения в конфигурации проекта
- **deps** - обновление зависимостей

## Примеры коммитов

### Простые коммиты

```bash
feat(entities): добавлена загрузка файлов в Supabase Storage
fix(features): исправлена валидация формы регистрации
refactor(shared): вынесена функция создания signed URLs
docs(config): обновлена документация по настройке Supabase
```

### Коммиты с несколькими областями

```bash
feat(entities,features): интеграция загрузки файлов в процесс регистрации
```

### Коммиты с детальным описанием

```bash
feat(entities): добавлена загрузка файлов в Supabase Storage

- Создан модуль storage.ts с функциями uploadFiles и getFileUrls
- Файлы загружаются в bucket 'documents' с структурой {userId}/{role}/{key}/{fileName}
- Пути к файлам сохраняются в поле documents (JSONB) в doctor_profiles/clinic_profiles
- При повторном входе файлы автоматически отправляются в модерацию

Closes #123
```

### Коммиты с breaking changes

```bash
refactor(entities): изменена структура хранения файлов

BREAKING CHANGE: поле documents теперь хранится в JSONB формате вместо отдельных полей
```

## Правила

1. **Subject** (первая строка):
   - Максимум 72 символа
   - Начинается с маленькой буквы
   - Без точки в конце
   - В повелительном наклонении: "добавить", "исправить", "обновить"

2. **Body** (опционально):
   - Отделяется пустой строкой от subject
   - Объясняет **что** и **почему**, а не **как**
   - Может содержать несколько пунктов через дефис

3. **Footer** (опционально):
   - Ссылки на issues: `Closes #123`, `Fixes #456`
   - Breaking changes: `BREAKING CHANGE: описание`

## Примеры для вашего проекта

```bash
# Регистрация
feat(features): добавлена форма регистрации с валидацией
feat(entities): создан API для работы с профилями пользователей
feat(entities): добавлена загрузка документов в Storage

# Авторизация
feat(entities): интеграция Supabase Auth
fix(features): исправлена обработка ошибок при входе
refactor(entities): оптимизирована загрузка профиля пользователя

# Модерация
feat(shared): добавлен Edge Function для отправки запросов в Telegram
feat(shared): реализован webhook для обработки действий модерации
fix(shared): исправлена обработка пустого тела запроса в webhook

# Рефакторинг
refactor(entities): разделение профилей на role-specific таблицы
refactor(features): улучшена обработка ошибок в useSignUpForm

# Конфигурация
chore(config): обновлены зависимости проекта
chore(config): добавлена настройка TypeScript strict mode
```

## Инструменты

### Автоматизация с помощью commitizen

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npm install --save-dev commitizen cz-conventional-changelog
```

Добавить в `package.json`:
```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "scripts": {
    "commit": "cz"
  }
}
```

Теперь можно использовать:
```bash
npm run commit
```

### Pre-commit hook (опционально)

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```
