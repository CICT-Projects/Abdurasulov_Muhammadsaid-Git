using Microsoft.AspNetCore.Mvc;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly CarService _carService;

    public CarsController(CarService carService)
    {
        _carService = carService;
    }

    /// <summary>
    /// Получить все машины
    /// </summary>
    [HttpGet]
    public IActionResult GetAllCars()
    {
        var cars = _carService.GetAllCars();
        return Ok(cars);
    }

    /// <summary>
    /// Получить машину по ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetCarById(int id)
    {
        var car = _carService.GetCarById(id);
        if (car == null)
            return NotFound(new { message = "Машина не найдена" });

        return Ok(car);
    }

    /// <summary>
    /// Создать новую машину
    /// </summary>
    [HttpPost]
    public IActionResult CreateCar([FromBody] Car car)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdCar = _carService.CreateCar(car);
        return CreatedAtAction(nameof(GetCarById), new { id = createdCar.Id }, createdCar);
    }

    /// <summary>
    /// Обновить машину
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateCar(int id, [FromBody] Car car)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedCar = _carService.UpdateCar(id, car);
        if (updatedCar == null)
            return NotFound(new { message = "Машина не найдена" });

        return Ok(updatedCar);
    }

    /// <summary>
    /// Удалить машину
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteCar(int id)
    {
        var success = _carService.DeleteCar(id);
        if (!success)
            return NotFound(new { message = "Машина не найдена" });

        return NoContent();
    }
}

