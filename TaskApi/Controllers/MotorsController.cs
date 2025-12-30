using Microsoft.AspNetCore.Mvc;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotorsController : ControllerBase
{
    private readonly MotorService _motorService;

    public MotorsController(MotorService motorService)
    {
        _motorService = motorService;
    }

    /// <summary>
    /// Получить все моторы
    /// </summary>
    [HttpGet]
    public IActionResult GetAllMotors()
    {
        var motors = _motorService.GetAll();
        return Ok(motors);
    }

    /// <summary>
    /// Получить мотор по ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetMotorById(int id)
    {
        var motor = _motorService.GetById(id);
        if (motor == null)
            return NotFound(new { message = "Мотор не найден" });

        return Ok(motor);
    }

    /// <summary>
    /// Создать новый мотор
    /// </summary>
    [HttpPost]
    public IActionResult CreateMotor([FromBody] Motor motor)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdMotor = _motorService.Create(motor);
        return CreatedAtAction(nameof(GetMotorById), new { id = createdMotor.Id }, createdMotor);
    }

    /// <summary>
    /// Обновить мотор
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateMotor(int id, [FromBody] Motor motor)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedMotor = _motorService.Update(id, motor);
        if (updatedMotor == null)
            return NotFound(new { message = "Мотор не найден" });

        return Ok(updatedMotor);
    }

    /// <summary>
    /// Удалить мотор
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteMotor(int id)
    {
        var result = _motorService.Delete(id);
        if (!result)
            return NotFound(new { message = "Мотор не найден" });

        return NoContent();
    }
}

