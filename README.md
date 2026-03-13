# LegalFlow 2.0 — Цифровой юрист для бизнеса

Полнофункциональная веб-платформа для анализа договоров, оценки юридических рисков и генерации документов. Состоит из React фронтенда и Node.js бэкенда с MongoDB.

## 🚀 Функциональность

### 📋 Анализ договоров
- Загрузка PDF, DOC, DOCX файлов
- AI-анализ на наличие рисков
- Цветовая разметка опасных пунктов
- Рекомендации по исправлению
- Ссылки на статьи ГК РФ

### 🛠 Конструктор договоров
- 6-шаговый визард
- Шаблоны для разных типов работ
- Учет роли (исполнитель/заказчик)
- Настройка оплаты и интеллектуальных прав
- Автоматическая генерация договора

### 💬 Анализ переписки
- Импорт из Telegram, WhatsApp, Email
- Выявление юридически значимых моментов
- Обнаружение изменения объема работ (scope creep)
- Рекомендации по защите

### 🧮 Калькулятор финансовых рисков
- Расчет максимальной ответственности
- Проверка соразмерности неустойки (ст. 333 ГК РФ)
- Анализ годовой ставки неустойки
- Рекомендации по оптимизации

## 🏗 Архитектура

```
legalflow/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API контроллеры
│   │   ├── middleware/      # Middleware (auth, upload, error handling)
│   │   ├── models/          # Mongoose модели
│   │   ├── routes/          # API роуты
│   │   ├── services/        # Бизнес-логика
│   │   └── server.js        # Точка входа
│   ├── uploads/             # Загруженные файлы
│   └── package.json
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── store/           # Zustand store
│   │   ├── services/        # API клиент
│   │   └── App.jsx          # Корневой компонент
│   └── package.json
│
└── docker-compose.yml       # Docker конфигурация
```

## 🛠 Технологический стек

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** аутентификация
- **Multer** для загрузки файлов
- **Helmet** + **CORS** для безопасности

### Frontend
- **React 18** + **Vite**
- **React Router** для навигации
- **TanStack Query** для работы с API
- **Zustand** для состояния
- **Tailwind CSS** для стилей
- **Lucide React** для иконок

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- MongoDB 6+
- Docker (опционально)

### Локальный запуск

1. **Клонировать репозиторий**
```bash
git clone <repo-url>
cd legalflow
```

2. **Настроить backend**
```bash
cd backend
cp .env.example .env
# Отредактировать .env, указать MONGODB_URI и JWT_SECRET
npm install
npm run dev
```

3. **Настроить frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Открыть приложение**
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```

### Docker запуск

```bash
# Собрать и запустить
docker-compose up --build

# Только база данных
docker-compose up mongo
```

## 📁 Переменные окружения

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legalflow
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_MAX_SIZE=10485760
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/demo` - Демо вход
- `GET /api/auth/me` - Профиль пользователя

### Договоры
- `POST /api/contracts/upload` - Загрузить договор
- `GET /api/contracts` - Список договоров
- `GET /api/contracts/:id` - Получить договор
- `POST /api/contracts/generate` - Сгенерировать договор
- `DELETE /api/contracts/:id` - Удалить договор

### Анализ
- `POST /api/chat/analyze` - Анализ переписки
- `POST /api/analysis/risks/calculate` - Расчет рисков

## 🔒 Безопасность

- JWT токены с истечением срока
- Хеширование паролей (bcrypt)
- Rate limiting
- CORS защита
- Helmet headers
- Валидация входных данных

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm test

# Frontend тесты
cd frontend
npm test
```

## 📦 Деплой

### Backend (Heroku/Railway/Render)
```bash
cd backend
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Задеплоить папку dist
```

## 📄 Лицензия

MIT License

## 🤝 Поддержка

При возникновении проблем создавайте Issue в репозитории.

---

**LegalFlow 2.0** — защита вашего бизнеса начинается с правильного договора.
