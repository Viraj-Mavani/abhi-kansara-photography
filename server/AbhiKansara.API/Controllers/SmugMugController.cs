using AbhiKansara.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AbhiKansara.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SmugMugController : ControllerBase
{
    private readonly ISmugMugService _smugMug;
    private readonly ILogger<SmugMugController> _logger;

    public SmugMugController(ISmugMugService smugMug, ILogger<SmugMugController> logger)
    {
        _smugMug = smugMug;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/smugmug/albums
    /// Lists all available albums from the linked SmugMug account.
    /// </summary>
    [HttpGet("albums")]
    public async Task<IActionResult> ListAlbums()
    {
        try
        {
            var albums = await _smugMug.GetAlbumsAsync();
            return Ok(albums);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching SmugMug albums for picker");
            return StatusCode(500, new { message = "Failed to fetch albums from SmugMug." });
        }
    }
}
