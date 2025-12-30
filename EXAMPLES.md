# 📋 Примеры расширения функционала

Вот несколько примеров того, как можно улучшить приложение.

## 1. Добавление базы данных (Entity Framework Core + SQL Server)

### Шаг 1: Установите NuGet пакеты
```bash
cd TaskApi
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

### Шаг 2: Создайте DbContext
```csharp
using Microsoft.EntityFrameworkCore;

public class CarsDbContext : DbContext
{
    public CarsDbContext(DbContextOptions<CarsDbContext> options) : base(options) { }
    
    public DbSet<Car> Cars { get; set; }
}
```

### Шаг 3: Обновите Program.cs
```csharp
builder.Services.AddDbContext<CarsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Замените CarService на DbContext в контроллере
```

### Шаг 4: Миграции
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 2. Добавление аутентификации (JWT)

### Шаг 1: Установите пакеты
```bash
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.IdentityModel.Tokens
```

### Шаг 2: Создайте сервис аутентификации
```csharp
public class AuthService
{
    private readonly IConfiguration _config;
    
    public AuthService(IConfiguration config) => _config = config;
    
    public string GenerateToken(string userId)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### Шаг 3: Добавьте защиту на контроллер
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Требует JWT токен
public class CarsController : ControllerBase
{
    // ...
}
```

### Шаг 4: В appsettings.json
```json
{
  "Jwt": {
    "Key": "your-very-long-secret-key-here-minimum-16-chars",
    "Issuer": "your-app",
    "Audience": "your-app-users"
  }
}
```

---

## 3. Добавление валидации (FluentValidation)

### Шаг 1: Установите пакет
```bash
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
```

### Шаг 2: Создайте validator
```csharp
using FluentValidation;

public class CarValidator : AbstractValidator<Car>
{
    public CarValidator()
    {
        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("Марка обязательна")
            .MaximumLength(50).WithMessage("Марка не должна быть более 50 символов");
        
        RuleFor(x => x.Model)
            .NotEmpty().WithMessage("Модель обязательна");
        
        RuleFor(x => x.Year)
            .GreaterThanOrEqualTo(1900).WithMessage("Год должен быть не меньше 1900")
            .LessThanOrEqualTo(DateTime.Now.Year).WithMessage("Год не может быть в будущем");
        
        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Цвет обязателен");
    }
}
```

### Шаг 3: Зарегистрируйте в Program.cs
```csharp
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining(typeof(Program));
```

---

## 4. Добавление фильтрации и поиска

### В контроллере:
```csharp
[HttpGet]
public IActionResult GetAllCars([FromQuery] string? brand = null, [FromQuery] int? year = null)
{
    var cars = _carService.GetAllCars();
    
    if (!string.IsNullOrEmpty(brand))
        cars = cars.Where(c => c.Brand.Contains(brand, StringComparison.OrdinalIgnoreCase));
    
    if (year.HasValue)
        cars = cars.Where(c => c.Year == year);
    
    return Ok(cars);
}
```

### На фронтенде:
```jsx
const [filterBrand, setFilterBrand] = useState('');
const [filterYear, setFilterYear] = useState('');

const fetchCars = async () => {
    let url = API_URL;
    const params = new URLSearchParams();
    
    if (filterBrand) params.append('brand', filterBrand);
    if (filterYear) params.append('year', filterYear);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    // ...
};
```

---

## 5. Добавление сортировки

### В контроллере:
```csharp
[HttpGet]
public IActionResult GetAllCars([FromQuery] string? sortBy = "id", [FromQuery] bool ascending = true)
{
    var cars = _carService.GetAllCars();
    
    cars = sortBy?.ToLower() switch
    {
        "brand" => ascending ? cars.OrderBy(c => c.Brand) : cars.OrderByDescending(c => c.Brand),
        "year" => ascending ? cars.OrderBy(c => c.Year) : cars.OrderByDescending(c => c.Year),
        "model" => ascending ? cars.OrderBy(c => c.Model) : cars.OrderByDescending(c => c.Model),
        _ => ascending ? cars.OrderBy(c => c.Id) : cars.OrderByDescending(c => c.Id)
    };
    
    return Ok(cars);
}
```

---

## 6. Добавление пагинации

### В контроллере:
```csharp
[HttpGet]
public IActionResult GetAllCars([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
{
    var cars = _carService.GetAllCars();
    var totalCount = cars.Count();
    
    var result = cars
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();
    
    return Ok(new
    {
        data = result,
        totalCount = totalCount,
        pageCount = (int)Math.Ceiling((double)totalCount / pageSize)
    });
}
```

---

## 7. Добавление логирования

### Шаг 1: В Program.cs
```csharp
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});
```

### Шаг 2: В контроллере
```csharp
public class CarsController : ControllerBase
{
    private readonly ILogger<CarsController> _logger;
    
    public CarsController(ILogger<CarsController> logger)
    {
        _logger = logger;
    }
    
    [HttpPost]
    public IActionResult CreateCar([FromBody] Car car)
    {
        _logger.LogInformation($"Добавляется машина: {car.Brand} {car.Model}");
        // ...
    }
}
```

---

## 8. Добавление обработки ошибок (Exception Handling)

### Создайте middleware:
```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    
    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Необработанное исключение");
            
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            
            await httpContext.Response.WriteAsJsonAsync(new
            {
                message = "Internal server error",
                detail = ex.Message
            });
        }
    }
}
```

### Зарегистрируйте в Program.cs:
```csharp
app.UseMiddleware<ExceptionHandlingMiddleware>();
```

---

## 9. Загрузка изображений машин

### Добавьте свойство в модель:
```csharp
public class Car
{
    // ... существующие поля
    public string? ImageUrl { get; set; }
}
```

### В контроллере:
```csharp
[HttpPost("upload-image/{id}")]
public async Task<IActionResult> UploadImage(int id, IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("Нет файла");
    
    var uploadsFolder = Path.Combine("wwwroot", "images");
    Directory.CreateDirectory(uploadsFolder);
    
    var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
    
    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(fileStream);
    }
    
    var car = _carService.GetCarById(id);
    car.ImageUrl = $"/images/{uniqueFileName}";
    
    return Ok(car);
}
```

---

## 10. Кэширование результатов

### Используйте MemoryCache:
```csharp
public class CarsController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private const string CARS_CACHE_KEY = "cars_list";
    
    [HttpGet]
    public IActionResult GetAllCars()
    {
        if (_cache.TryGetValue(CARS_CACHE_KEY, out IEnumerable<Car>? cars))
            return Ok(cars);
        
        cars = _carService.GetAllCars();
        _cache.Set(CARS_CACHE_KEY, cars, TimeSpan.FromMinutes(5));
        
        return Ok(cars);
    }
    
    [HttpPost]
    public IActionResult CreateCar([FromBody] Car car)
    {
        var createdCar = _carService.CreateCar(car);
        _cache.Remove(CARS_CACHE_KEY); // Инвалидируем кэш
        return CreatedAtAction(nameof(GetCarById), new { id = createdCar.Id }, createdCar);
    }
}
```

---

## 📝 Примеры на фронтенде

### Добавление notification при успешной операции:
```jsx
const showNotification = (message, type = 'success') => {
    // Используйте какую-то библиотеку (react-toastify и т.д.)
    toast[type](message);
};

const handleAddCar = async (e) => {
    e.preventDefault();
    try {
        // ... код добавления
        showNotification('Машина успешно добавлена!', 'success');
    } catch (error) {
        showNotification('Ошибка при добавлении машины', 'error');
    }
};
```

### Добавление loading spinner:
```jsx
const [isLoading, setIsLoading] = useState(false);

const handleAddCar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // ...
    } finally {
        setIsLoading(false);
    }
};

return (
    <>
        {isLoading && <div className="spinner">Загрузка...</div>}
        {/* остальной код */}
    </>
);
```

---

## 🚀 Что выбрать в первую очередь?

1. **Критично**: Добавить БД (пункт 1)
2. **Важно**: Добавить валидацию (пункт 3)
3. **Безопасность**: Добавить JWT аутентификацию (пункт 2)
4. **UX**: Добавить поиск/фильтрацию (пункт 4)
5. **Производительность**: Добавить кэширование (пункт 10)

Выбирайте в зависимости от требований вашего проекта!

