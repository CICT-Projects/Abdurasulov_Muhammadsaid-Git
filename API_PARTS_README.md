# 🚗 Система управления автозапчастями

## Описание проекта

Полнофункциональное веб-приложение для управления автомобилями и запчастями с использованием:
- **Backend**: ASP.NET Core (.NET 10) с REST API
- **Frontend**: React 19 с маршрутизацией (React Router DOM)
- **Хранение**: JSON файлы в папке `data/`

## Структура проекта

### Backend (TaskApi)

#### Модели данных:
- **Car** - Автомобили (марка, модель, год, цвет)
- **Motor** - Моторы (название, мощность, тип, цена)
- **Window** - Окна (название, позиция, тонировка, цена)
- **Tire** - Шины (бренд, размер, износ, цена)
- **Body** - Корпусы (тип, цвет, материал, цена)

#### API Эндпоинты:

**Машины:**
- `GET /api/cars` - Получить все машины
- `GET /api/cars/{id}` - Получить машину по ID
- `POST /api/cars` - Создать новую машину
- `PUT /api/cars/{id}` - Обновить машину
- `DELETE /api/cars/{id}` - Удалить машину

**Моторы:**
- `GET /api/motors` - Получить все моторы
- `GET /api/motors/{id}` - Получить мотор по ID
- `POST /api/motors` - Создать мотор
- `PUT /api/motors/{id}` - Обновить мотор
- `DELETE /api/motors/{id}` - Удалить мотор

**Окна:**
- `GET /api/windows` - Получить все окна
- `GET /api/windows/{id}` - Получить окно по ID
- `POST /api/windows` - Создать окно
- `PUT /api/windows/{id}` - Обновить окно
- `DELETE /api/windows/{id}` - Удалить окно

**Шины:**
- `GET /api/tires` - Получить все шины
- `GET /api/tires/{id}` - Получить шину по ID
- `POST /api/tires` - Создать шину
- `PUT /api/tires/{id}` - Обновить шину
- `DELETE /api/tires/{id}` - Удалить шину

**Корпусы:**
- `GET /api/bodies` - Получить все корпусы
- `GET /api/bodies/{id}` - Получить корпус по ID
- `POST /api/bodies` - Создать корпус
- `PUT /api/bodies/{id}` - Обновить корпус
- `DELETE /api/bodies/{id}` - Удалить корпус

### Frontend (React)

#### Страницы:

1. **Home** (`/`) - Главная страница с навигацией
   - Красивые карточки для каждого раздела
   - Ссылки на все CRUD операции
   - Адаптивный дизайн

2. **Cars** (`/cars`) - Управление автомобилями
   - Просмотр всех машин
   - Добавление новых машин
   - Редактирование машин
   - Удаление машин

3. **Motors** (`/motors`) - Управление моторами
   - CRUD операции для моторов
   - Выбор типа двигателя
   - Отображение мощности и цены

4. **Windows** (`/windows`) - Управление окнами
   - CRUD операции для окон
   - Выбор позиции окна
   - Опция тонировки

5. **Tires** (`/tires`) - Управление шинами
   - CRUD операции для шин
   - Отслеживание износа
   - Размеры шин

6. **Bodies** (`/bodies`) - Управление корпусами
   - CRUD операции для корпусов
   - Выбор типа корпуса
   - Материалы кузова

## Установка и запуск

### Требования:
- .NET 10 SDK
- Node.js 18+
- npm

### Backend:

```bash
cd TaskApi
dotnet build
dotnet run
```

API будет доступен по адресу: `http://localhost:5026`

### Frontend:

```bash
cd frontend
npm install
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

## Структура файлов

### Backend:
```
TaskApi/
├── Program.cs (модели, сервисы, конфигурация)
├── Controllers/
│   ├── CarsController.cs
│   ├── MotorsController.cs
│   ├── WindowsController.cs
│   ├── TiresController.cs
│   └── BodiesController.cs
└── data/ (JSON файлы с данными)
    ├── cars.json
    ├── motors.json
    ├── windows.json
    ├── tires.json
    └── bodies.json
```

### Frontend:
```
frontend/src/
├── App.jsx (маршрутизация)
├── App.css
├── Home.jsx (главная страница)
├── Home.css
├── Motors.jsx (управление моторами)
├── Windows.jsx (управление окнами)
├── Tires.jsx (управление шинами)
├── Bodies.jsx (управление корпусами)
├── Parts.css (общие стили для запчастей)
└── main.jsx
```

## Особенности

✅ **RESTful API** - Полная поддержка CRUD операций
✅ **Персистентность** - Данные сохраняются в JSON файлы
✅ **CORS** - Включена поддержка кросс-доменных запросов
✅ **Маршрутизация** - React Router DOM для навигации
✅ **Адаптивный дизайн** - Мобильная верстка включена
✅ **Красивый UI** - Градиенты, анимации, карточки
✅ **Независимые запчасти** - Каждая запчасть полностью независима

## Использованные технологии

### Backend:
- ASP.NET Core 10
- C# 13
- System.Text.Json для работы с JSON
- File I/O для персистентности

### Frontend:
- React 19
- React Router DOM 6
- CSS3 с градиентами и анимациями
- Vite как сборщик

## API Примеры

### Создание мотора:
```bash
curl -X POST http://localhost:5026/api/motors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "V6 Turbo",
    "power": 350,
    "type": "Бензин",
    "price": 4500
  }'
```

### Получение всех шин:
```bash
curl http://localhost:5026/api/tires
```

### Обновление окна:
```bash
curl -X PUT http://localhost:5026/api/windows/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Front Right",
    "position": "Переднее боковое",
    "tinted": true,
    "price": 320
  }'
```

## Лицензия

MIT

---

**Разработано:** GitHub Copilot
**Дата:** 2025

