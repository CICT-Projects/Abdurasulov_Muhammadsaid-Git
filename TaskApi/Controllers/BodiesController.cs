using Microsoft.AspNetCore.Mvc;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BodiesController : ControllerBase
{
    private readonly BodyService _bodyService;

    public BodiesController(BodyService bodyService)
    {
        _bodyService = bodyService;
    }

    /// <summary>
    /// Получить все корпусы
    /// </summary>
    [HttpGet]
    public IActionResult GetAllBodies()
    {
        var bodies = _bodyService.GetAll();
        return Ok(bodies);
    }

    /// <summary>
    /// Получить корпус по ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetBodyById(int id)
    {
        var body = _bodyService.GetById(id);
        if (body == null)
            return NotFound(new { message = "Корпус не найден" });

        return Ok(body);
    }

    /// <summary>
    /// Создать новый корпус
    /// </summary>
    [HttpPost]
    public IActionResult CreateBody([FromBody] Body body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdBody = _bodyService.Create(body);
        return CreatedAtAction(nameof(GetBodyById), new { id = createdBody.Id }, createdBody);
    }

    /// <summary>
    /// Обновить корпус
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateBody(int id, [FromBody] Body body)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedBody = _bodyService.Update(id, body);
        if (updatedBody == null)
            return NotFound(new { message = "Корпус не найден" });

        return Ok(updatedBody);
    }

    /// <summary>
    /// Удалить корпус
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteBody(int id)
    {
        var result = _bodyService.Delete(id);
        if (!result)
            return NotFound(new { message = "Корпус не найден" });

        return NoContent();
    }
}

