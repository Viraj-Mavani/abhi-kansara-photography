using AbhiKansara.Core.Entities;
using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarouselController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarouselController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCarouselItems()
    {
        var items = await _context.CarouselItems
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        return Ok(items);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCarouselItem([FromBody] CarouselItem item)
    {
        if (item == null) return BadRequest("Invalid item.");

        item.Id = Guid.NewGuid().ToString("N");
        _context.CarouselItems.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCarouselItems), new { id = item.Id }, item);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCarouselItem(string id, [FromBody] CarouselItem item)
    {
        if (id != item.Id) return BadRequest("ID mismatch.");

        var existingItem = await _context.CarouselItems.FindAsync(id);
        if (existingItem == null) return NotFound();

        existingItem.Title = item.Title;
        existingItem.ImageUrl = item.ImageUrl;
        existingItem.SortOrder = item.SortOrder;

        _context.CarouselItems.Update(existingItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<string> ids)
    {
        if (ids == null || ids.Count == 0) return BadRequest("IDs list is empty.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            for (int i = 0; i < ids.Count; i++)
            {
                var id = ids[i];
                await _context.CarouselItems
                    .Where(c => c.Id == id)
                    .ExecuteUpdateAsync(s => s.SetProperty(c => c.SortOrder, i));
            }

            await transaction.CommitAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "Reorder failed.", detail = ex.Message });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCarouselItem(string id)
    {
        var item = await _context.CarouselItems.FindAsync(id);
        if (item == null) return NotFound();

        _context.CarouselItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
