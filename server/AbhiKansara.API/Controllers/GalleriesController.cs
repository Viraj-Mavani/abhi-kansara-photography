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
    /// Manually wires FK navigation references to bypass EF Core model validation.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] AbhiKansara.Core.Entities.ProjectGallery gallery)
    {
        gallery.Id = Guid.NewGuid();

        foreach (var media in gallery.Media)
        {
            media.Id = Guid.NewGuid();
            media.ProjectGalleryId = gallery.Id;
            media.ProjectGallery = gallery;
        }

        _context.ProjectGalleries.Add(gallery);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = gallery.Slug }, gallery);
    }

    /// <summary>
    /// PUT /api/galleries/{id}
    /// Full replace of a gallery and its media items.
    /// Manually wires FK navigation references to bypass EF Core model validation.
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

        // 1. Manually map scalar properties (don't overwrite Id or CreatedAt)
        existingGallery.Slug = updatedGallery.Slug;
        existingGallery.ClientName = updatedGallery.ClientName;
        existingGallery.Category = updatedGallery.Category;
        existingGallery.CoverPhotoUrl = updatedGallery.CoverPhotoUrl;
        existingGallery.ShootDate = updatedGallery.ShootDate;
        existingGallery.Location = updatedGallery.Location;
        existingGallery.Description = updatedGallery.Description;
        existingGallery.IsFeatured = updatedGallery.IsFeatured;
        existingGallery.Order = updatedGallery.Order;

        // 2. Clear then re-add to the tracked collection (Single Transaction)
        existingGallery.Media.Clear();

        foreach (var media in updatedGallery.Media)
        {
            media.Id = Guid.NewGuid();
            media.ProjectGalleryId = id;
            media.ProjectGallery = existingGallery;
            existingGallery.Media.Add(media);
        }

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
