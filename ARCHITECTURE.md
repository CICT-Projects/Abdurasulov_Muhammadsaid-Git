# 📐 Архитектура проекта

## 🏗️ Общая структура

```
┌─────────────────────────────────────────────────────┐
│         WEB ПРИЛОЖЕНИЕ (React + Router)             │
│  http://localhost:5173                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         HOME PAGE (/)                        │  │
│  │  [Машины] [Моторы] [Окна] [Шины] [Корпусы] │  │
│  └──────────────────────────────────────────────┘  │
│           ↓           ↓         ↓        ↓       ↓   │
│        /cars      /motors   /windows  /tires  /bodies
│         │           │          │        │        │   │
│    ┌────┴──────┬────┴──┬───────┴────┬───┴────┬──┴┐  │
│    │           │       │            │        │    │  │
│    v           v       v            v        v    v  │
│  [Cars]   [Motors]  [Windows]   [Tires]  [Bodies]   │
│  Page     Page      Page        Page     Page       │
│    │        │        │           │        │         │
│    │CRUD    │CRUD    │CRUD       │CRUD    │CRUD     │
│    │        │        │           │        │         │
└─────────────────────────────────────────────────────┘
          │        │        │           │        │
          ↓        ↓        ↓           ↓        ↓
┌─────────────────────────────────────────────────────┐
│         REST API (ASP.NET Core)                     │
│  http://localhost:5026/api                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐ ┌───────────┐ ┌──────────┐ ┌──────┐ │
│  │ Motors    │ │ Windows   │ │ Tires    │ │Bodies│ │
│  │ Controller│ │ Controller│ │Controller│ │Ctrl  │ │
│  └─────┬─────┘ └─────┬─────┘ └────┬─────┘ └──┬───┘ │
│        │             │            │          │      │
│        ↓             ↓            ↓          ↓      │
│  ┌─────────────────────────────────────────────┐   │
│  │      Services (Generic PartsService<T>)     │   │
│  │  MotorService | WindowService | TireService│   │
│  │         BodyService (по типу)              │   │
│  └─────────────────────────────────────────────┘   │
│        │             │            │          │      │
│        ↓             ↓            ↓          ↓      │
│  ┌─────────────────────────────────────────────┐   │
│  │          Data Layer (JSON Files)             │   │
│  │  motors.json | windows.json | tires.json |  │   │
│  │         bodies.json                         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Backend архитектура

### Program.cs
```
Program.cs
├── Models
│   ├── Car (существует)
│   ├── Motor
│   ├── Window
│   ├── Tire
│   └── Body
│
├── Services
│   ├── CarService
│   ├── PartsService<T> (Generic base)
│   │   ├── MotorService
│   │   ├── WindowService
│   │   ├── TireService
│   │   └── BodyService
│   └── Каждый сервис:
│       ├── GetAll()
│       ├── GetById(id)
│       ├── Create(item)
│       ├── Update(id, item)
│       ├── Delete(id)
│       └── SaveToFile()
│
└── Configuration
    ├── CORS Policy "AllowReact"
    └── DI Container
        ├── CarService
        ├── MotorService
        ├── WindowService
        ├── TireService
        └── BodyService
```

### Controllers
```
Controllers/
├── CarsController.cs (существует)
├── MotorsController.cs
│   ├── GetAllMotors() - GET /api/motors
│   ├── GetMotorById(id) - GET /api/motors/{id}
│   ├── CreateMotor(motor) - POST /api/motors
│   ├── UpdateMotor(id, motor) - PUT /api/motors/{id}
│   └── DeleteMotor(id) - DELETE /api/motors/{id}
│
├── WindowsController.cs
│   ├── GetAllWindows() - GET /api/windows
│   ├── GetWindowById(id) - GET /api/windows/{id}
│   ├── CreateWindow(window) - POST /api/windows
│   ├── UpdateWindow(id, window) - PUT /api/windows/{id}
│   └── DeleteWindow(id) - DELETE /api/windows/{id}
│
├── TiresController.cs
│   ├── GetAllTires() - GET /api/tires
│   ├── GetTireById(id) - GET /api/tires/{id}
│   ├── CreateTire(tire) - POST /api/tires
│   ├── UpdateTire(id, tire) - PUT /api/tires/{id}
│   └── DeleteTire(id) - DELETE /api/tires/{id}
│
└── BodiesController.cs
    ├── GetAllBodies() - GET /api/bodies
    ├── GetBodyById(id) - GET /api/bodies/{id}
    ├── CreateBody(body) - POST /api/bodies
    ├── UpdateBody(id, body) - PUT /api/bodies/{id}
    └── DeleteBody(id) - DELETE /api/bodies/{id}
```

### Data Storage
```
bin/Debug/net10.0/data/
├── cars.json
│   └── [
│       { id: 1, brand: "Toyota", model: "Camry", year: 2022, color: "Black" }
│       ]
├── motors.json
│   └── [
│       { id: 1, name: "V8 Turbo", power: 450, type: "Бензин", price: 5000 }
│       ]
├── windows.json
│   └── [
│       { id: 1, name: "Front Left", position: "Переднее", tinted: false, price: 300 }
│       ]
├── tires.json
│   └── [
│       { id: 1, brand: "Michelin", size: "225/50R17", wear: 0, price: 120 }
│       ]
└── bodies.json
    └── [
        { id: 1, type: "Седан", color: "Черный", material: "Металл", price: 15000 }
        ]
```

---

## 🎨 Frontend архитектура

### Структура компонентов
```
src/
├── App.jsx
│   └── <Router>
│       ├── <Route path="/">
│       │   └── <Home />
│       ├── <Route path="/cars">
│       │   └── <Cars />
│       ├── <Route path="/motors">
│       │   └── <Motors />
│       ├── <Route path="/windows">
│       │   └── <Windows />
│       ├── <Route path="/tires">
│       │   └── <Tires />
│       └── <Route path="/bodies">
│           └── <Bodies />
│
├── Home.jsx
│   ├── State: none
│   └── UI:
│       ├── Заголовок
│       ├── 5 Карточек навигации
│       │   ├── Машины
│       │   ├── Моторы
│       │   ├── Окна
│       │   ├── Шины
│       │   └── Корпусы
│       └── Футер
│
├── Motors.jsx (и аналогично для Windows, Tires, Bodies)
│   ├── State:
│   │   ├── motors (список)
│   │   ├── loading (флаг загрузки)
│   │   ├── editingId (ID редактируемого)
│   │   └── formData (данные формы)
│   ├── Hooks:
│   │   └── useEffect (загрузка при открытии)
│   ├── Функции:
│   │   ├── fetchMotors()
│   │   ├── handleInputChange()
│   │   ├── handleAddMotor()
│   │   ├── handleUpdateMotor()
│   │   ├── handleDeleteMotor()
│   │   └── handleEditClick()
│   └── UI:
│       ├── Кнопка "Назад"
│       ├── Форма добавления/редактирования
│       │   ├── Поля ввода
│       │   └── Кнопка отправки
│       └── Список карточек
│           └── Каждая карточка:
│               ├── Информация элемента
│               ├── Кнопка редактирования
│               └── Кнопка удаления
│
└── Cars.jsx (существует, переделан для маршрутизации)
    └── (аналогично Motors)
```

### Файловая структура стилей
```
src/
├── App.css
│   ├── Общие стили для контейнера
│   ├── Стили формы машин
│   ├── Стили кнопок
│   ├── Стили карточек машин
│   ├── Стили заголовка cars-header
│   ├── Стили кнопки back-to-home
│   └── Media queries
│
├── Home.css
│   ├── Стили контейнера главной страницы
│   ├── Стили заголовка
│   ├── Стили сетки навигации
│   ├── Стили карточек навигации
│   ├── Hover эффекты
│   ├── Анимации (fadeInDown, fadeInUp)
│   └── Media queries
│
└── Parts.css
    ├── Стили контейнера запчастей
    ├── Стили заголовка
    ├── Стили формы добавления
    ├── Стили кнопок
    ├── Стили сетки элементов
    ├── Стили карточек
    ├── Стили кнопок действий
    └── Media queries
```

---

## 🔄 Data Flow (Поток данных)

### Получение данных (Read)
```
User clicks on "Моторы" page
         ↓
Motors.jsx component mounts
         ↓
useEffect hook triggers
         ↓
fetchMotors() called
         ↓
fetch(http://localhost:5026/api/motors)
         ↓
GET /api/motors (MotorsController)
         ↓
_motorService.GetAll()
         ↓
Reads motors.json file
         ↓
Returns JSON array
         ↓
Frontend receives data
         ↓
setMotors(data)
         ↓
Components re-renders with motors list
         ↓
User sees motor cards
```

### Добавление данных (Create)
```
User fills form and clicks "Add"
         ↓
handleAddMotor() called
         ↓
fetch POST to http://localhost:5026/api/motors
         ↓
POST /api/motors (MotorsController)
         ↓
ValidateModelState
         ↓
_motorService.Create(motor)
         ↓
Assigns next ID
         ↓
Adds to motors list
         ↓
SaveToFile() (atomic write)
         ↓
Returns 201 Created with new motor
         ↓
Frontend refreshes list
         ↓
New motor appears in list
```

### Обновление данных (Update)
```
User clicks "Edit" and modifies form
         ↓
handleUpdateMotor() called
         ↓
fetch PUT to http://localhost:5026/api/motors/{id}
         ↓
PUT /api/motors/{id} (MotorsController)
         ↓
_motorService.Update(id, motor)
         ↓
Finds motor by ID
         ↓
Updates all properties
         ↓
SaveToFile() (atomic write)
         ↓
Returns 200 OK with updated motor
         ↓
Frontend refreshes list
         ↓
Motor card updates
```

### Удаление данных (Delete)
```
User clicks "Delete" and confirms
         ↓
handleDeleteMotor() called with ID
         ↓
fetch DELETE to http://localhost:5026/api/motors/{id}
         ↓
DELETE /api/motors/{id} (MotorsController)
         ↓
_motorService.Delete(id)
         ↓
Finds motor by ID
         ↓
Removes from motors list
         ↓
SaveToFile() (atomic write)
         ↓
Returns 204 No Content
         ↓
Frontend refreshes list
         ↓
Motor card disappears
```

---

## 🔐 Thread Safety & Persistence

### File Operations Flow
```
┌─────────────────────────┐
│  Service Method Called  │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│   Acquire Lock          │
│ (lock (fileLock))       │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│  Create Temp File       │
│  (.tmp extension)       │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│  Write to Temp File     │
│  (JSON Serialize)       │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│  Atomic Replace         │
│ (Rename temp to actual) │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│  Release Lock           │
│ (unlock fileLock)       │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│  Return Result          │
└─────────────────────────┘
```

---

## 📊 Entity Relationship (Независимость)

```
┌─────────────────────────────────────────────────────┐
│                  Car (Машина)                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ id, brand, model, year, color               │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ❌ НЕ связана с запчастями                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Motor (Мотор)                         │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ id, name, power, type, price                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ❌ Независим (собственная база данных)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Window (Окно)                         │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ id, name, position, tinted, price           │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ❌ Независим (собственная база данных)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Tire (Шина)                           │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ id, brand, size, wear, price                │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ❌ Независим (собственная база данных)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Body (Корпус)                         │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ id, type, color, material, price            │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ❌ Независим (собственная база данных)             │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Performance Considerations

```
Кэширование:
  ✅ Данные хранятся в памяти (List<T>)
  ✅ Не требуется переваривание при каждом запросе
  ✅ Только сохранение в файл при изменении

Масштабируемость:
  ✅ Generic сервис для новых типов
  ✅ Просто добавить новый контроллер и сервис
  ✅ Без изменения существующего кода

Оптимизация:
  ✅ Минимальные сетевые запросы
  ✅ Lazy loading при открытии страницы
  ✅ Atomic file writes (no corruption)
  ✅ Thread-safe операции

Надежность:
  ✅ Восстановление при ошибках чтения
  ✅ Fallback механизмы
  ✅ Валидация на уровне контроллера
  ✅ Error handling в сервисах
```

---

**Проект полностью готов! 🎉**

