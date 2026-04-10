using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

/// <summary>
/// Public API for portfolio galleries.
/// Returns nested JSON matching the frontend Gallery structure with MediaItems.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GalleriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GalleriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/galleries
    /// Returns all galleries ordered by display order, with nested media items.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var galleries = await _context.ProjectGalleries
            .OrderBy(g => g.Order)
            .Include(g => g.Media.OrderBy(m => m.Order))
            .AsNoTracking()
            .ToListAsync();

        return Ok(galleries);
    }

    /// <summary>
    /// GET /api/galleries/featured
    /// Returns only featured galleries (for the landing page / Best-of-Us section).
    /// </summary>
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var galleries = await _context.ProjectGalleries
            .Where(g => g.IsFeatured)
            .OrderBy(g => g.Order)
            .Include(g => g.Media.OrderBy(m => m.Order))
            .AsNoTracking()
            .ToListAsync();

        return Ok(galleries);
    }

    /// <summary>
    /// GET /api/galleries/{slug}
    /// Returns a single gallery with all its media items by URL slug.
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var gallery = await _context.ProjectGalleries
            .Where(g => g.Slug == slug)
            .Include(g => g.Media.OrderBy(m => m.Order))
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (gallery is null)
            return NotFound(new { message = $"Gallery with slug '{slug}' not found." });

        return Ok(gallery);
    }

    /// <summary>
    /// GET /api/galleries/categories
    /// Returns a list of unique categories that have at least one gallery.
    /// </summary>
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.ProjectGalleries
            .Select(g => g.Category)
            .Distinct()
            .OrderBy(c => c)
            .AsNoTracking()
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// POST /api/galleries
    /// Creates a new gallery and its media items.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] AbhiKansara.Core.Entities.ProjectGallery gallery)
    {
        _context.ProjectGalleries.Add(gallery);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = gallery.Slug }, gallery);
    }

    /// <summary>
    /// PUT /api/galleries/{id}
    /// Full replace of a gallery and its media items.
    /// </summary>
    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AbhiKansara.Core.Entities.ProjectGallery updatedGallery)
    {
        if (id != updatedGallery.Id) return BadRequest(new { message = "ID mismatch." });

        var existingGallery = await _context.ProjectGalleries
            .Include(g => g.Media)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (existingGallery == null) return NotFound();

        // Remove existing media and replace with incoming media
        _context.RemoveRange(existingGallery.Media);
        _context.Entry(existingGallery).CurrentValues.SetValues(updatedGallery);
        existingGallery.Media = updatedGallery.Media;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.ProjectGalleries.AnyAsync(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// DELETE /api/galleries/{id}
    /// Deletes a gallery (cascade deletes media).
    /// </summary>
    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var gallery = await _context.ProjectGalleries.FindAsync(id);
        if (gallery == null) return NotFound();

        _context.ProjectGalleries.Remove(gallery);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
