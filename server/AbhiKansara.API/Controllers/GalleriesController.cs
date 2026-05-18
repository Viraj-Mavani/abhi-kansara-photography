using AbhiKansara.Core.Interfaces;
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
    private readonly ISmugMugService _smugMug;
    private readonly ILogger<GalleriesController> _logger;

    public GalleriesController(
        ApplicationDbContext context,
        ISmugMugService smugMug,
        ILogger<GalleriesController> logger)
    {
        _context = context;
        _smugMug = smugMug;
        _logger = logger;
    }


    /// <summary>
    /// GET /api/galleries
    /// Returns all galleries ordered by display order, with nested media items.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var galleries = await _context.ProjectGalleries
            .OrderByDescending(g => g.IsFeatured)
            .ThenBy(g => g.IsFeatured ? g.Order : 0)
            .ThenByDescending(g => g.UpdatedAt)
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
                    .SetProperty(g => g.SmugMugAlbumId, updatedGallery.SmugMugAlbumId)
                    .SetProperty(g => g.SmugMugAlbumKey, updatedGallery.SmugMugAlbumKey)
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

    /// <summary>
    /// POST /api/galleries/{id}/smugmug-link
    /// Stores SmugMug album credentials for a gallery without syncing.
    /// </summary>
    [HttpPost("{id}/smugmug-link")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> LinkSmugMug(Guid id, [FromBody] SmugMugLinkRequest request)
    {
        var rowsAffected = await _context.ProjectGalleries
            .Where(g => g.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(g => g.SmugMugAlbumId, request.AlbumId)
                .SetProperty(g => g.SmugMugAlbumKey, request.AlbumKey)
                .SetProperty(g => g.UpdatedAt, DateTime.UtcNow));

        if (rowsAffected == 0) return NotFound();

        return Ok(new
        {
            message = "SmugMug album linked successfully.",
            albumId = request.AlbumId,
            albumKey = request.AlbumKey
        });
    }

    /// <summary>
    /// POST /api/galleries/{id}/smugmug-sync
    /// Fetches images from a linked SmugMug album and replaces the gallery's media items.
    /// Requires the gallery to have SmugMugAlbumId and SmugMugAlbumKey set.
    /// </summary>
    [HttpPost("{id}/smugmug-sync")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> SyncSmugMug(Guid id)
    {
        var gallery = await _context.ProjectGalleries.FindAsync(id);
        if (gallery is null)
            return NotFound(new { message = "Gallery not found." });

        if (string.IsNullOrEmpty(gallery.SmugMugAlbumKey))
            return BadRequest(new { message = "No SmugMug album key linked to this gallery. Link an album first." });

        try
        {
            _logger.LogInformation("Starting SmugMug sync for gallery {GalleryId} (album {AlbumKey})",
                id, gallery.SmugMugAlbumKey);

            // 1. Fetch images from SmugMug
            var smugMugImages = (await _smugMug.GetAlbumImagesAsync(
                gallery.SmugMugAlbumId ?? "", gallery.SmugMugAlbumKey)).ToList();

            if (smugMugImages.Count == 0)
                return Ok(new { message = "SmugMug album is empty. No images to sync.", syncedCount = 0 });

            // 2. Clear existing media and replace with SmugMug images
            _context.ChangeTracker.Clear();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.MediaItems
                    .Where(m => m.ProjectGalleryId == id)
                    .ExecuteDeleteAsync();

                foreach (var img in smugMugImages)
                {
                    img.Id = Guid.NewGuid();
                    img.ProjectGalleryId = id;
                }

                await _context.MediaItems.AddRangeAsync(smugMugImages);

                // Update the gallery's sync timestamp
                await _context.ProjectGalleries
                    .Where(g => g.Id == id)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(g => g.LastSmugMugSync, DateTimeOffset.UtcNow)
                        .SetProperty(g => g.UpdatedAt, DateTime.UtcNow));

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            // 3. Re-fetch the updated gallery to return it
            var updated = await _context.ProjectGalleries
                .Where(g => g.Id == id)
                .Include(g => g.Media.OrderBy(m => m.Order))
                .AsNoTracking()
                .FirstAsync();

            _logger.LogInformation("SmugMug sync complete for gallery {GalleryId}: {Count} images synced",
                id, smugMugImages.Count);

            return Ok(new
            {
                message = $"Successfully synced {smugMugImages.Count} images from SmugMug.",
                syncedCount = smugMugImages.Count,
                lastSync = updated.LastSmugMugSync,
                gallery = updated
            });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "SmugMug API error during sync for gallery {GalleryId}", id);
            return StatusCode(502, new { message = $"SmugMug API error: {ex.Message}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during SmugMug sync for gallery {GalleryId}", id);
            return StatusCode(500, new { message = $"Sync failed: {ex.Message}" });
        }
    }

    /// <summary>
    /// GET /api/galleries/smugmug-images?albumId=...&albumKey=...
    /// Fetches all images for a specific SmugMug album WITHOUT requiring a gallery record.
    /// Used for "instant sync" preview during gallery creation.
    /// </summary>
    [HttpGet("smugmug-images")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSmugMugImagesStateless([FromQuery] string? albumId, [FromQuery] string albumKey)
    {
        try
        {
            _logger.LogInformation("Stateless SmugMug image fetch requested for AlbumId: {AlbumId}, AlbumKey: {AlbumKey}", albumId, albumKey);
            var images = await _smugMug.GetAlbumImagesAsync(albumId ?? "", albumKey);
            return Ok(images);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during stateless SmugMug fetch");
            return StatusCode(500, new { message = $"Failed to fetch images: {ex.Message}" });
        }
    }

    /// <summary>
    /// GET /api/galleries/smugmug-albums
    /// Lists all available albums from the linked SmugMug account.
    /// </summary>
    [HttpGet("smugmug-albums")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> ListSmugMugAlbums()
    {
        try
        {
            var albums = await _smugMug.GetAlbumsAsync();
            return Ok(albums);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching SmugMug albums");
            return StatusCode(500, new { message = "Failed to fetch albums from SmugMug." });
        }
    }

    /// <summary>
    /// PATCH /api/galleries/reorder
    /// Bulk updates the sort order of featured galleries.
    /// </summary>
    [HttpPatch("reorder")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reorder([FromBody] List<Guid> galleryIds)
    {
        if (galleryIds == null || !galleryIds.Any())
            return BadRequest(new { message = "No gallery IDs provided for reordering." });

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            for (int i = 0; i < galleryIds.Count; i++)
            {
                await _context.ProjectGalleries
                    .Where(g => g.Id == galleryIds[i])
                    .ExecuteUpdateAsync(s => s.SetProperty(g => g.Order, i));
            }

            await transaction.CommitAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Failed to reorder galleries.");
            return StatusCode(500, new { message = "An error occurred while reordering galleries." });
        }
    }
}

/// <summary>Request body for POST /api/galleries/{id}/smugmug-link</summary>
public record SmugMugLinkRequest(string? AlbumId, string? AlbumKey);
