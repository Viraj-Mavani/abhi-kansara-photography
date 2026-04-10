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
    /// Includes nested packages, add-ons, process, testimonials, and FAQs.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _context.Services
            .OrderBy(s => s.Order)
            .Include(s => s.Packages.OrderBy(p => p.Order))
                .ThenInclude(p => p.Deliverables.OrderBy(d => d.Order))
            .Include(s => s.AddOns.OrderBy(a => a.Order))
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
            .Include(s => s.Packages.OrderBy(p => p.Order))
                .ThenInclude(p => p.Deliverables.OrderBy(d => d.Order))
            .Include(s => s.AddOns.OrderBy(a => a.Order))
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
    /// Creates a new service and all nested nested items.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] AbhiKansara.Core.Entities.Service service)
    {
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
            .Include(s => s.Packages).ThenInclude(p => p.Deliverables)
            .Include(s => s.AddOns)
            .Include(s => s.ProcessSteps)
            .Include(s => s.Testimonials)
            .Include(s => s.FAQs)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (existingService == null) return NotFound();

        // Standard trick for a massive object tree update: Remove all existing collections and add the ones from payload.
        // EF Core handles the tracking. For real production, mapping specific IDs is optimal, but full replacement is best for headless CMS.
        _context.RemoveRange(existingService.Packages);
        _context.RemoveRange(existingService.AddOns);
        _context.RemoveRange(existingService.ProcessSteps);
        _context.RemoveRange(existingService.Testimonials);
        _context.RemoveRange(existingService.FAQs);

        // Update scalars
        _context.Entry(existingService).CurrentValues.SetValues(updatedService);

        // Add back new lists
        existingService.Packages = updatedService.Packages;
        existingService.AddOns = updatedService.AddOns;
        existingService.ProcessSteps = updatedService.ProcessSteps;
        existingService.Testimonials = updatedService.Testimonials;
        existingService.FAQs = updatedService.FAQs;

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
