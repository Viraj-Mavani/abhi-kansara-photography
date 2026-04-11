using AbhiKansara.Core.Entities;
using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroBackgroundsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HeroBackgroundsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var backgrounds = await _context.HeroBackgrounds
            .OrderBy(b => b.Order)
            .AsNoTracking()
            .ToListAsync();
        return Ok(backgrounds);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HeroBackground background)
    {
        background.Id = Guid.NewGuid();
        _context.HeroBackgrounds.Add(background);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), null, background);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HeroBackground background)
    {
        if (id != background.Id) return BadRequest();

        var existing = await _context.HeroBackgrounds.FindAsync(id);
        if (existing == null) return NotFound();

        existing.ImageUrl = background.ImageUrl;
        existing.AltText = background.AltText;
        existing.Order = background.Order;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var background = await _context.HeroBackgrounds.FindAsync(id);
        if (background == null) return NotFound();

        _context.HeroBackgrounds.Remove(background);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
