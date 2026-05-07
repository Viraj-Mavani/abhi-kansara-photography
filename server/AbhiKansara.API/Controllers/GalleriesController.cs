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

        // Clear tracker to ensure no stale references or binder-tracked entities interfere
        _context.ChangeTracker.Clear();

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Update the main entity directly in the DB
            var rowsAffected = await _context.ProjectGalleries
                .Where(g => g.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(g => g.Slug, updatedGallery.Slug)
                    .SetProperty(g => g.ClientName, updatedGallery.ClientName)
                    .SetProperty(g => g.Category, updatedGallery.Category)
                    .SetProperty(g => g.CoverPhotoUrl, updatedGallery.CoverPhotoUrl)
                    .SetProperty(g => g.ShootDate, updatedGallery.ShootDate)
                    .SetProperty(g => g.Location, updatedGallery.Location)
                    .SetProperty(g => g.Description, updatedGallery.Description)
                    .SetProperty(g => g.IsFeatured, updatedGallery.IsFeatured)
                    .SetProperty(g => g.Order, updatedGallery.Order)
                    .SetProperty(g => g.UpdatedAt, DateTime.UtcNow));

            if (rowsAffected == 0) return NotFound();

            // 2. Clear old media items
            await _context.MediaItems.Where(m => m.ProjectGalleryId == id).ExecuteDeleteAsync();

            // 3. Add new media items as fresh tracked entities
            var mediaToInsert = updatedGallery.Media.Select(m => new AbhiKansara.Core.Entities.MediaItem
            {
                Id = Guid.NewGuid(),
                ProjectGalleryId = id,
                Type = m.Type,
                Url = m.Url,
                Width = m.Width,
                Height = m.Height,
                Alt = m.Alt,
                PosterUrl = m.PosterUrl,
                HlsUrl = m.HlsUrl,
                Duration = m.Duration,
                Order = m.Order
            }).ToList();

            if (mediaToInsert.Any())
            {
                await _context.MediaItems.AddRangeAsync(mediaToInsert);
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
            return NoContent();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
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
