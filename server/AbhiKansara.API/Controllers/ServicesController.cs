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

        // Clear tracker to ensure no stale references or binder-tracked entities interfere
        _context.ChangeTracker.Clear();

        // Use a transaction to ensure atomicity for children replacement
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // 1. Update the main entity directly in the DB
            var rowsAffected = await _context.Services
                .Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(s => s.Title, updatedService.Title)
                    .SetProperty(s => s.Slug, updatedService.Slug)
                    .SetProperty(s => s.Tagline, updatedService.Tagline)
                    .SetProperty(s => s.CoverImage, updatedService.CoverImage)
                    .SetProperty(s => s.Icon, updatedService.Icon)
                    .SetProperty(s => s.ShortDescription, updatedService.ShortDescription)
                    .SetProperty(s => s.DetailedDescription, updatedService.DetailedDescription)
                    .SetProperty(s => s.Features, updatedService.Features)
                    .SetProperty(s => s.Highlights, updatedService.Highlights)
                    .SetProperty(s => s.GalleryImages, updatedService.GalleryImages)
                    .SetProperty(s => s.Category, updatedService.Category)
                    .SetProperty(s => s.Order, updatedService.Order)
                    .SetProperty(s => s.IsFeatured, updatedService.IsFeatured)
                    .SetProperty(s => s.UpdatedAt, DateTime.UtcNow));

            if (rowsAffected == 0) return NotFound();

            // 2. Clear old children
            await _context.ServiceProcesses.Where(p => p.ServiceId == id).ExecuteDeleteAsync();
            await _context.ServiceTestimonials.Where(t => t.ServiceId == id).ExecuteDeleteAsync();
            await _context.ServiceFAQs.Where(f => f.ServiceId == id).ExecuteDeleteAsync();

            // 3. Add new children as fresh instances
            var steps = updatedService.ProcessSteps.Select(s => new AbhiKansara.Core.Entities.ServiceProcess
            {
                Id = Guid.NewGuid(),
                ServiceId = id,
                StepNumber = s.StepNumber,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
                Order = s.Order
            }).ToList();

            var testimonials = updatedService.Testimonials.Select(t => new AbhiKansara.Core.Entities.ServiceTestimonial
            {
                Id = Guid.NewGuid(),
                ServiceId = id,
                ClientName = t.ClientName,
                Quote = t.Quote,
                Event = t.Event,
                Avatar = t.Avatar,
                Rating = t.Rating,
                Order = t.Order
            }).ToList();

            var faqs = updatedService.FAQs.Select(f => new AbhiKansara.Core.Entities.ServiceFAQ
            {
                Id = Guid.NewGuid(),
                ServiceId = id,
                Question = f.Question,
                Answer = f.Answer,
                Order = f.Order
            }).ToList();

            if (steps.Any()) await _context.ServiceProcesses.AddRangeAsync(steps);
            if (testimonials.Any()) await _context.ServiceTestimonials.AddRangeAsync(testimonials);
            if (faqs.Any()) await _context.ServiceFAQs.AddRangeAsync(faqs);

            await _context.SaveChangesAsync();
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
