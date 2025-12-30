using Microsoft.AspNetCore.Mvc;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TiresController : ControllerBase
{
    private readonly TireService _tireService;

    public TiresController(TireService tireService)
    {
        _tireService = tireService;
    }

    /// <summary>
    /// Получить все шины
    /// </summary>
    [HttpGet]
    public IActionResult GetAllTires()
    {
        var tires = _tireService.GetAll();
        return Ok(tires);
    }

    /// <summary>
    /// Получить шину по ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetTireById(int id)
    {
        var tire = _tireService.GetById(id);
        if (tire == null)
            return NotFound(new { message = "Шина не найдена" });

        return Ok(tire);
    }

    /// <summary>
    /// Создать новую шину
    /// </summary>
    [HttpPost]
    public IActionResult CreateTire([FromBody] Tire tire)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdTire = _tireService.Create(tire);
        return CreatedAtAction(nameof(GetTireById), new { id = createdTire.Id }, createdTire);
    }

    /// <summary>
    /// Обновить шину
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateTire(int id, [FromBody] Tire tire)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedTire = _tireService.Update(id, tire);
        if (updatedTire == null)
            return NotFound(new { message = "Шина не найдена" });

        return Ok(updatedTire);
    }

    /// <summary>
    /// Удалить шину
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteTire(int id)
    {
        var result = _tireService.Delete(id);
        if (!result)
            return NotFound(new { message = "Шина не найдена" });

        return NoContent();
    }
}

