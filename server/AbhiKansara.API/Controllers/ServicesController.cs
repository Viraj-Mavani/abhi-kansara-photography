using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

/// <summary>
/// Public API for photography services.
/// Returns nested JSON matching the frontend DetailedService structure.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServicesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/services
    /// Returns all services ordered by display order.
    /// Includes nested process, testimonials, and FAQs.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _context.Services
            .OrderBy(s => s.Order)
            .Include(s => s.ProcessSteps.OrderBy(p => p.Order))
            .Include(s => s.Testimonials.OrderBy(t => t.Order))
            .Include(s => s.FAQs.OrderBy(f => f.Order))
            .AsNoTracking()
            .ToListAsync();

        return Ok(services);
    }

    /// <summary>
    /// GET /api/services/{slug}
    /// Returns a single service with all nested data by its URL slug.
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var service = await _context.Services
            .Where(s => s.Slug == slug)
            .Include(s => s.ProcessSteps.OrderBy(p => p.Order))
            .Include(s => s.Testimonials.OrderBy(t => t.Order))
            .Include(s => s.FAQs.OrderBy(f => f.Order))
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (service is null)
            return NotFound(new { message = $"Service with slug '{slug}' not found." });

        return Ok(service);
    }

    /// <summary>
    /// POST /api/services
    /// Creates a new service and all nested items.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] AbhiKansara.Core.Entities.Service service)
    {
        service.Id = Guid.NewGuid();

        foreach (var step in service.ProcessSteps)
        {
            step.Id = Guid.NewGuid();
            step.ServiceId = service.Id;
            step.Service = service;
        }

        foreach (var testimonial in service.Testimonials)
        {
            testimonial.Id = Guid.NewGuid();
            testimonial.ServiceId = service.Id;
            testimonial.Service = service;
        }

        foreach (var faq in service.FAQs)
        {
            faq.Id = Guid.NewGuid();
            faq.ServiceId = service.Id;
            faq.Service = service;
        }

        _context.Services.Add(service);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = service.Slug }, service);
    }

    /// <summary>
    /// PUT /api/services/{id}
    /// Full replace of a service and its nested children.
    /// </summary>
    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AbhiKansara.Core.Entities.Service updatedService)
    {
        if (id != updatedService.Id) return BadRequest(new { message = "ID mismatch." });

        var existingService = await _context.Services
            .Include(s => s.ProcessSteps)
            .Include(s => s.Testimonials)
            .Include(s => s.FAQs)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (existingService == null) return NotFound();

        // 1. Manually map scalar properties (don't overwrite Id or CreatedAt)
        existingService.Title = updatedService.Title;
        existingService.Slug = updatedService.Slug;
        existingService.Tagline = updatedService.Tagline;
        existingService.CoverImage = updatedService.CoverImage;
        existingService.Icon = updatedService.Icon;
        existingService.ShortDescription = updatedService.ShortDescription;
        existingService.DetailedDescription = updatedService.DetailedDescription;
        existingService.Features = updatedService.Features;
        existingService.Highlights = updatedService.Highlights;
        existingService.GalleryImages = updatedService.GalleryImages;
        existingService.Category = updatedService.Category;
        existingService.Order = updatedService.Order;
        existingService.IsFeatured = updatedService.IsFeatured;

        // 2. Clear then re-add to all collections in a single transaction
        existingService.ProcessSteps.Clear();
        foreach (var step in updatedService.ProcessSteps)
        {
            step.Id = Guid.NewGuid();
            step.ServiceId = id;
            step.Service = existingService;
            existingService.ProcessSteps.Add(step);
        }

        existingService.Testimonials.Clear();
        foreach (var testimonial in updatedService.Testimonials)
        {
            testimonial.Id = Guid.NewGuid();
            testimonial.ServiceId = id;
            testimonial.Service = existingService;
            existingService.Testimonials.Add(testimonial);
        }

        existingService.FAQs.Clear();
        foreach (var faq in updatedService.FAQs)
        {
            faq.Id = Guid.NewGuid();
            faq.ServiceId = id;
            faq.Service = existingService;
            existingService.FAQs.Add(faq);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Services.AnyAsync(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// DELETE /api/services/{id}
    /// Deletes a service (cascade deletes children due to DB setup).
    /// </summary>
    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return NotFound();

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
