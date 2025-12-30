using System.IO;
using System.Text.Json;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<CarService>();

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseAuthorization();

// Маршруты контроллеров
app.MapControllers();

app.Run();

// Модель Car
public class Car
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Color { get; set; } = string.Empty;
}

// Сервис для работы с машинами (persist в JSON-файл)
public class CarService
{
    private List<Car> cars;
    private int nextId;
    private readonly string dataFilePath;
    private readonly object fileLock = new object();

    public CarService()
    {
        var dataDir = Path.Combine(AppContext.BaseDirectory, "data");
        Directory.CreateDirectory(dataDir);
        dataFilePath = Path.Combine(dataDir, "cars.json");

        if (File.Exists(dataFilePath))
        {
            try
            {
                var json = File.ReadAllText(dataFilePath);
                var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var loaded = JsonSerializer.Deserialize<List<Car>>(json, opts);
                if (loaded != null && loaded.Count > 0)
                {
                    cars = loaded;
                }
                else
                {
                    cars = GetDefaultCars();
                }
            }
            catch
            {
                // При ошибке чтения/парсинга — восстановим дефолтный набор
                cars = GetDefaultCars();
            }
        }
        else
        {
            cars = GetDefaultCars();
            SaveToFile();
        }

        nextId = (cars.Count > 0) ? cars.Max(c => c.Id) + 1 : 1;
    }

    private List<Car> GetDefaultCars() => new List<Car>
    {
        new Car { Id = 1, Brand = "Toyota", Model = "Camry", Year = 2022, Color = "Black" },
        new Car { Id = 2, Brand = "BMW", Model = "X5", Year = 2023, Color = "White" }
    };

    private void SaveToFile()
    {
        lock (fileLock)
        {
            var temp = dataFilePath + ".tmp";
            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(cars, options);

            File.WriteAllText(temp, json);
            try
            {
                if (File.Exists(dataFilePath))
                {
                    // Atomic replace (works if destination exists)
                    File.Replace(temp, dataFilePath, null);
                }
                else
                {
                    File.Move(temp, dataFilePath);
                }
            }
            catch
            {
                // Фоллбек: перезапишем файл напрямую
                try
                {
                    File.Copy(temp, dataFilePath, true);
                    File.Delete(temp);
                }
                catch
                {
                    // В крайнем случае — попробуем записать напрямую (потеря атомарности)
                    File.WriteAllText(dataFilePath, json);
                    if (File.Exists(temp)) File.Delete(temp);
                }
            }
        }
    }

    public IEnumerable<Car> GetAllCars() => cars;

    public Car? GetCarById(int id) => cars.FirstOrDefault(c => c.Id == id);

    public Car CreateCar(Car car)
    {
        car.Id = nextId++;
        cars.Add(car);
        try { SaveToFile(); } catch { }
        return car;
    }

    public Car? UpdateCar(int id, Car updatedCar)
    {
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return null;

        car.Brand = updatedCar.Brand;
        car.Model = updatedCar.Model;
        car.Year = updatedCar.Year;
        car.Color = updatedCar.Color;

        try { SaveToFile(); } catch { }
        return car;
    }

    public bool DeleteCar(int id)
    {
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return false;

        cars.Remove(car);
        try { SaveToFile(); } catch { }
        return true;
    }
}
