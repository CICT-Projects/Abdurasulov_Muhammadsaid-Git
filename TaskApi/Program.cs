using System.IO;
using System.Text.Json;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<CarService>();
builder.Services.AddSingleton<MotorService>();
builder.Services.AddSingleton<WindowService>();
builder.Services.AddSingleton<TireService>();
builder.Services.AddSingleton<BodyService>();

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

// Модель Motor (Мотор)
public class Motor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Power { get; set; }
    public string Type { get; set; } = string.Empty; // Бензин, дизель, электро
    public double Price { get; set; }
}

// Модель Window (Окно)
public class Window
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty; // Переднее, заднее, боковое
    public bool Tinted { get; set; }
    public double Price { get; set; }
}

// Модель Tire (Шина)
public class Tire
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty; // Например: 225/50R17
    public int Wear { get; set; } // Процент износа
    public double Price { get; set; }
}

// Модель Body (Корпус)
public class Body
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // Седан, кроссовер, хэтчбек
    public string Color { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty; // Металл, пластик
    public double Price { get; set; }
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

// Базовый сервис для запчастей
public abstract class PartsService<T> where T : class
{
    protected List<T> items;
    protected int nextId;
    protected readonly string dataFilePath;
    protected readonly object fileLock = new object();
    protected string itemName;

    protected PartsService(string fileName, string itemName)
    {
        this.itemName = itemName;
        var dataDir = Path.Combine(AppContext.BaseDirectory, "data");
        Directory.CreateDirectory(dataDir);
        dataFilePath = Path.Combine(dataDir, fileName);

        if (File.Exists(dataFilePath))
        {
            try
            {
                var json = File.ReadAllText(dataFilePath);
                var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var loaded = JsonSerializer.Deserialize<List<T>>(json, opts);
                items = loaded ?? GetDefaultItems();
            }
            catch
            {
                items = GetDefaultItems();
            }
        }
        else
        {
            items = GetDefaultItems();
            SaveToFile();
        }

        nextId = items.Count > 0 ? GetMaxId(items) + 1 : 1;
    }

    protected abstract List<T> GetDefaultItems();
    protected abstract int GetMaxId(List<T> list);

    protected void SaveToFile()
    {
        lock (fileLock)
        {
            var temp = dataFilePath + ".tmp";
            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(items, options);

            File.WriteAllText(temp, json);
            try
            {
                if (File.Exists(dataFilePath))
                {
                    File.Replace(temp, dataFilePath, null);
                }
                else
                {
                    File.Move(temp, dataFilePath);
                }
            }
            catch
            {
                try
                {
                    File.Copy(temp, dataFilePath, true);
                    File.Delete(temp);
                }
                catch
                {
                    File.WriteAllText(dataFilePath, json);
                    if (File.Exists(temp)) File.Delete(temp);
                }
            }
        }
    }

    public IEnumerable<T> GetAll() => items;

    public T? GetById(int id)
    {
        var prop = typeof(T).GetProperty("Id");
        return items.FirstOrDefault(i => (int?)prop?.GetValue(i) == id);
    }

    public T Create(T item)
    {
        var idProp = typeof(T).GetProperty("Id");
        idProp?.SetValue(item, nextId++);
        items.Add(item);
        try { SaveToFile(); } catch { }
        return item;
    }

    public T? Update(int id, T updatedItem)
    {
        var item = GetById(id);
        if (item == null) return null;

        var props = typeof(T).GetProperties();
        foreach (var prop in props)
        {
            if (prop.Name != "Id" && prop.CanWrite)
            {
                var value = prop.GetValue(updatedItem);
                prop.SetValue(item, value);
            }
        }

        try { SaveToFile(); } catch { }
        return item;
    }

    public bool Delete(int id)
    {
        var item = GetById(id);
        if (item == null) return false;

        items.Remove(item);
        try { SaveToFile(); } catch { }
        return true;
    }
}

// Сервис для моторов
public class MotorService : PartsService<Motor>
{
    public MotorService() : base("motors.json", "мотор") { }

    protected override List<Motor> GetDefaultItems() => new List<Motor>
    {
        new Motor { Id = 1, Name = "V8 Turbo", Power = 450, Type = "Бензин", Price = 5000 },
        new Motor { Id = 2, Name = "Diesel 2.0", Power = 200, Type = "Дизель", Price = 4000 }
    };

    protected override int GetMaxId(List<Motor> list) => list.Max(m => m.Id);
}

// Сервис для окон
public class WindowService : PartsService<Window>
{
    public WindowService() : base("windows.json", "окно") { }

    protected override List<Window> GetDefaultItems() => new List<Window>
    {
        new Window { Id = 1, Name = "Front Left", Position = "Переднее боковое", Tinted = false, Price = 300 },
        new Window { Id = 2, Name = "Rear Glass", Position = "Заднее", Tinted = true, Price = 250 }
    };

    protected override int GetMaxId(List<Window> list) => list.Max(w => w.Id);
}

// Сервис для шин
public class TireService : PartsService<Tire>
{
    public TireService() : base("tires.json", "шина") { }

    protected override List<Tire> GetDefaultItems() => new List<Tire>
    {
        new Tire { Id = 1, Brand = "Michelin", Size = "225/50R17", Wear = 0, Price = 120 },
        new Tire { Id = 2, Brand = "Bridgestone", Size = "205/55R16", Wear = 10, Price = 100 }
    };

    protected override int GetMaxId(List<Tire> list) => list.Max(t => t.Id);
}

// Сервис для корпусов
public class BodyService : PartsService<Body>
{
    public BodyService() : base("bodies.json", "корпус") { }

    protected override List<Body> GetDefaultItems() => new List<Body>
    {
        new Body { Id = 1, Type = "Седан", Color = "Черный", Material = "Металл", Price = 15000 },
        new Body { Id = 2, Type = "Кроссовер", Color = "Белый", Material = "Металл", Price = 18000 }
    };

    protected override int GetMaxId(List<Body> list) => list.Max(b => b.Id);
}

