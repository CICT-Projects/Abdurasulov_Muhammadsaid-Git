# 📚 Документация разработчика

## Архитектура приложения

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (5173)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  App.jsx - Управление состоянием и логика CRUD   │  │
│  │  App.css - Стили и анимации                       │  │
│  │  index.css - Глобальные стили                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                 .NET 10 API (5026)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Program.cs - Конфигурация и модели              │  │
│  │  Controllers/CarsController.cs - REST endpoints   │  │
│  │  CarService - Логика работы с машинами           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Компоненты бэкенда

### Program.cs
Точка входа приложения. Содержит:
- Конфигурация сервисов (CORS, контроллеры, CarService)
- Middleware (HTTPS, CORS, авторизация)
- Маршрутизацию контроллеров
- Модель `Car` с полями: Id, Brand, Model, Year, Color
- Сервис `CarService` с CRUD методами

### CarsController.cs
REST контроллер с endpoints:
```
GET    /api/cars          → GetAllCars()
GET    /api/cars/{id}     → GetCarById(id)
POST   /api/cars          → CreateCar(car)
PUT    /api/cars/{id}     → UpdateCar(id, car)
DELETE /api/cars/{id}     → DeleteCar(id)
```

## Компоненты фронтенда

### App.jsx
Главный компонент приложения:
- **State Management**: useState для управления состоянием
- **API Calls**: fetch для взаимодействия с бэкенд API
- **CRUD Operations**: функции для добавления, редактирования и удаления
- **Form Handling**: управление формой для создания и редактирования

### Ключевые функции:

#### fetchCars()
Загружает список всех машин с сервера
```javascript
const response = await fetch('http://localhost:5026/api/cars');
const data = await response.json();
```

#### handleAddCar(e)
Создает новую машину
```javascript
fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

#### handleUpdateCar(e)
Обновляет существующую машину
```javascript
fetch(`${API_URL}/${editingId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

#### handleDeleteCar(id)
Удаляет машину после подтверждения пользователя
```javascript
fetch(`${API_URL}/${id}`, {
  method: 'DELETE'
})
```

### App.css
Стили для:
- Градиентного фона
- Формы ввода
- Карточек машин
- Кнопок действий
- Адаптивного макета

### index.css
Глобальные стили для всего приложения

## Поток данных

### Добавление машины:
1. Пользователь заполняет форму
2. onClick отправляет POST запрос на `/api/cars`
3. Бэкенд добавляет машину в список и возвращает её с ID
4. Фронтенд добавляет машину в state и очищает форму
5. UI обновляется и показывает новую машину

### Редактирование машины:
1. Пользователь нажимает "Редактировать" на карточке
2. Форма заполняется данными выбранной машины
3. Пользователь меняет поля и нажимает "Сохранить"
4. PUT запрос отправляется на `/api/cars/{id}`
5. Бэкенд обновляет машину и возвращает обновленные данные
6. State обновляется, форма очищается
7. UI показывает обновленную карточку

### Удаление машины:
1. Пользователь нажимает "Удалить"
2. Появляется подтверждение delete
3. DELETE запрос отправляется на `/api/cars/{id}`
4. Бэкенд удаляет машину из списка
5. Фронтенд удаляет машину из state
6. UI обновляется

## CORS настройки

В `Program.cs` настроен CORS для всех источников:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

Это позволяет фронтенду на localhost:5173 безопасно общаться с бэкенд API на localhost:5026

## Обработка ошибок

### Фронтенд:
- Валидация формы перед отправкой
- try/catch для обработки ошибок fetch
- Проверка статуса ответа (response.ok)
- Подтверждение перед удалением

### Бэкенд:
- ModelState.IsValid для валидации данных
- Проверка наличия машины перед обновлением/удалением
- Правильные HTTP статусы ответов (200, 201, 204, 400, 404)

## Запуск в development режиме

### Бэкенд:
```bash
cd TaskApi
dotnet run
```

### Фронтенд:
```bash
cd frontend
npm run dev
```

### Оба сразу (Windows):
```bash
run.bat
```

## Сборка для production

### Фронтенд:
```bash
cd frontend
npm run build
```

Создаст оптимизированную версию в папке `dist/`

### Бэкенд:
```bash
cd TaskApi
dotnet publish -c Release
```

## Возможные расширения

### 1. Добавление базы данных
```csharp
builder.Services.AddDbContext<CarsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 2. Добавление аутентификации
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* конфигурация */ });
```

### 3. Добавление валидации с FluentValidation
```csharp
builder.Services.AddFluentValidation();
```

### 4. Добавление логирования
```csharp
builder.Services.AddLogging();
```

### 5. Добавление кэширования
```csharp
builder.Services.AddMemoryCache();
```

## Тестирование API

Используйте файл `CarsApi.http` в VS Code с расширением REST Client:
```
GET http://localhost:5026/api/cars

###

POST http://localhost:5026/api/cars
Content-Type: application/json

{
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2023,
  "color": "White"
}
```

## Отладка

### Фронтенд:
- F12 в браузере для DevTools
- Смотрите консоль для ошибок JavaScript
- Network tab для отладки API запросов

### Бэкенд:
- Debug в Visual Studio / Rider
- Добавьте breakpoints в контроллер
- Смотрите логи консоли при запуске

## Производительность

### Оптимизации фронтенда:
- Минификация и bundle в production
- Ленивая загрузка компонентов
- React.memo для оптимизации рендера

### Оптимизации бэкенда:
- Добавить пагинацию для больших списков
- Кэширование часто запрашиваемых данных
- Асинхронные операции для длительных процессов

## Безопасность

- ✅ CORS настроен правильно
- ⚠️ Нет аутентификации (для production добавить JWT)
- ⚠️ Нет валидации на сервере (добавить FluentValidation)
- ⚠️ Нет HTTPS сертификата для production (настроить)
- ✅ Данные хранятся в памяти (добавить БД для production)

## Контакты разработчика

Если у вас есть вопросы, обратитесь в документацию или создайте issue.

