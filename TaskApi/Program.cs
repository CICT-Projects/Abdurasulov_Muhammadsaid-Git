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

// Сервис для работы с машинами
public class CarService
{
    private List<Car> cars = new List<Car>
    {
        new Car { Id = 1, Brand = "Toyota", Model = "Camry", Year = 2022, Color = "Black" },
        new Car { Id = 2, Brand = "BMW", Model = "X5", Year = 2023, Color = "White" }
    };

    private int nextId = 3;

    public IEnumerable<Car> GetAllCars() => cars;

    public Car? GetCarById(int id) => cars.FirstOrDefault(c => c.Id == id);

    public Car CreateCar(Car car)
    {
        car.Id = nextId++;
        cars.Add(car);
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

        return car;
    }

    public bool DeleteCar(int id)
    {
        var car = cars.FirstOrDefault(c => c.Id == id);
        if (car == null) return false;

        cars.Remove(car);
        return true;
    }
}
