using Microsoft.AspNetCore.Mvc;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WindowsController : ControllerBase
{
    private readonly WindowService _windowService;

    public WindowsController(WindowService windowService)
    {
        _windowService = windowService;
    }

    /// <summary>
    /// Получить все окна
    /// </summary>
    [HttpGet]
    public IActionResult GetAllWindows()
    {
        var windows = _windowService.GetAll();
        return Ok(windows);
    }

    /// <summary>
    /// Получить окно по ID
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetWindowById(int id)
    {
        var window = _windowService.GetById(id);
        if (window == null)
            return NotFound(new { message = "Окно не найдено" });

        return Ok(window);
    }

    /// <summary>
    /// Создать новое окно
    /// </summary>
    [HttpPost]
    public IActionResult CreateWindow([FromBody] Window window)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdWindow = _windowService.Create(window);
        return CreatedAtAction(nameof(GetWindowById), new { id = createdWindow.Id }, createdWindow);
    }

    /// <summary>
    /// Обновить окно
    /// </summary>
    [HttpPut("{id}")]
    public IActionResult UpdateWindow(int id, [FromBody] Window window)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedWindow = _windowService.Update(id, window);
        if (updatedWindow == null)
            return NotFound(new { message = "Окно не найдено" });

        return Ok(updatedWindow);
    }

    /// <summary>
    /// Удалить окно
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult DeleteWindow(int id)
    {
        var result = _windowService.Delete(id);
        if (!result)
            return NotFound(new { message = "Окно не найдено" });

        return NoContent();
    }
}

