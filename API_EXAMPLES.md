# 📚 API Примеры использования

## Базовый URL
```
http://localhost:5026/api
```

---

## 🚗 МАШИНЫ (Cars)

### Получить все машины
```http
GET /api/cars
```

**Ответ:**
```json
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "color": "Black"
  }
]
```

### Получить машину по ID
```http
GET /api/cars/1
```

### Создать новую машину
```http
POST /api/cars
Content-Type: application/json

{
  "brand": "Mercedes",
  "model": "C-Class",
  "year": 2023,
  "color": "Silver"
}
```

### Обновить машину
```http
PUT /api/cars/1
Content-Type: application/json

{
  "brand": "Mercedes",
  "model": "E-Class",
  "year": 2023,
  "color": "Silver"
}
```

### Удалить машину
```http
DELETE /api/cars/1
```

---

## ⚙️ МОТОРЫ (Motors)

### Получить все моторы
```http
GET /api/motors
```

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "V8 Turbo",
    "power": 450,
    "type": "Бензин",
    "price": 5000
  }
]
```

### Получить мотор по ID
```http
GET /api/motors/1
```

### Создать мотор
```http
POST /api/motors
Content-Type: application/json

{
  "name": "V6 Turbo",
  "power": 350,
  "type": "Бензин",
  "price": 4500
}
```

**Типы моторов:**
- `Бензин`
- `Дизель`
- `Электро`
- `Гибрид`

### Обновить мотор
```http
PUT /api/motors/1
Content-Type: application/json

{
  "name": "V8 Turbo Enhanced",
  "power": 480,
  "type": "Бензин",
  "price": 5200
}
```

### Удалить мотор
```http
DELETE /api/motors/1
```

---

## 🪟 ОКНА (Windows)

### Получить все окна
```http
GET /api/windows
```

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Front Left",
    "position": "Переднее боковое",
    "tinted": false,
    "price": 300
  }
]
```

### Получить окно по ID
```http
GET /api/windows/1
```

### Создать окно
```http
POST /api/windows
Content-Type: application/json

{
  "name": "Rear Window",
  "position": "Заднее",
  "tinted": true,
  "price": 350
}
```

**Позиции окон:**
- `Переднее`
- `Переднее боковое`
- `Заднее боковое`
- `Заднее`

### Обновить окно
```http
PUT /api/windows/1
Content-Type: application/json

{
  "name": "Front Left Updated",
  "position": "Переднее боковое",
  "tinted": true,
  "price": 320
}
```

### Удалить окно
```http
DELETE /api/windows/1
```

---

## 🛞 ШИНЫ (Tires)

### Получить все шины
```http
GET /api/tires
```

**Ответ:**
```json
[
  {
    "id": 1,
    "brand": "Michelin",
    "size": "225/50R17",
    "wear": 0,
    "price": 120
  }
]
```

### Получить шину по ID
```http
GET /api/tires/1
```

### Создать шину
```http
POST /api/tires
Content-Type: application/json

{
  "brand": "Pirelli",
  "size": "225/45R18",
  "wear": 5,
  "price": 150
}
```

**Популярные размеры:**
- `205/55R16`
- `225/50R17`
- `225/45R18`
- `235/45R19`

### Обновить шину
```http
PUT /api/tires/1
Content-Type: application/json

{
  "brand": "Michelin",
  "size": "225/50R17",
  "wear": 15,
  "price": 120
}
```

### Удалить шину
```http
DELETE /api/tires/1
```

---

## 🔧 КОРПУСЫ (Bodies)

### Получить все корпусы
```http
GET /api/bodies
```

**Ответ:**
```json
[
  {
    "id": 1,
    "type": "Седан",
    "color": "Черный",
    "material": "Металл",
    "price": 15000
  }
]
```

### Получить корпус по ID
```http
GET /api/bodies/1
```

### Создать корпус
```http
POST /api/bodies
Content-Type: application/json

{
  "type": "Кроссовер",
  "color": "Красный",
  "material": "Металл",
  "price": 18000
}
```

**Типы корпусов:**
- `Седан`
- `Кроссовер`
- `Хэтчбек`
- `Минивэн`
- `Пикап`

**Материалы:**
- `Металл`
- `Пластик`
- `Композит`
- `Углеволокно`

### Обновить корпус
```http
PUT /api/bodies/1
Content-Type: application/json

{
  "type": "Кроссовер",
  "color": "Синий",
  "material": "Композит",
  "price": 19000
}
```

### Удалить корпус
```http
DELETE /api/bodies/1
```

---

## 🧪 Тестирование с curl (PowerShell)

### Получить все объекты
```powershell
curl.exe http://localhost:5026/api/motors
curl.exe http://localhost:5026/api/windows
curl.exe http://localhost:5026/api/tires
curl.exe http://localhost:5026/api/bodies
```

### Создать объект
```powershell
$body = @{
    name = "V12 Engine"
    power = 600
    type = "Бензин"
    price = 7000
} | ConvertTo-Json

curl.exe -X POST http://localhost:5026/api/motors `
  -H "Content-Type: application/json" `
  -d $body
```

### Обновить объект
```powershell
$body = @{
    name = "V8 Modified"
    power = 500
    type = "Бензин"
    price = 5500
} | ConvertTo-Json

curl.exe -X PUT http://localhost:5026/api/motors/1 `
  -H "Content-Type: application/json" `
  -d $body
```

### Удалить объект
```powershell
curl.exe -X DELETE http://localhost:5026/api/motors/1
```

---

## 📊 Коды ответов

| Код | Значение |
|-----|----------|
| 200 | OK - Успешно |
| 201 | Created - Объект создан |
| 204 | No Content - Успешно удалено |
| 400 | Bad Request - Ошибка в запросе |
| 404 | Not Found - Объект не найден |
| 500 | Internal Server Error - Ошибка сервера |

---

## 💾 JSON файлы

Данные хранятся в JSON файлах в папке `data/`:
- `motors.json` - Моторы
- `windows.json` - Окна
- `tires.json` - Шины
- `bodies.json` - Корпусы

Например, содержимое `motors.json`:
```json
[
  {
    "id": 1,
    "name": "V8 Turbo",
    "power": 450,
    "type": "Бензин",
    "price": 5000
  },
  {
    "id": 2,
    "name": "Diesel 2.0",
    "power": 200,
    "type": "Дизель",
    "price": 4000
  }
]
```

---

Готово! Все API готовы к использованию! 🎉

