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
    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<Guid> ids)
    {
        if (ids == null || ids.Count == 0) return BadRequest("IDs list is empty.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Bulk update the Order for each ID in the sequence provided
            for (int i = 0; i < ids.Count; i++)
            {
                var id = ids[i];
                await _context.HeroBackgrounds
                    .Where(b => b.Id == id)
                    .ExecuteUpdateAsync(s => s.SetProperty(b => b.Order, i));
            }

            await transaction.CommitAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            // Log the error (simplified for this context)
            Console.WriteLine($"Error reordering HeroBackgrounds: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during reordering.", detail = ex.Message });
        }
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
