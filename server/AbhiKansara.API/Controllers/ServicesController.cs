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
    /// Creates a new service and all nested items.
    /// Manually wires FK navigation references to bypass EF Core model validation.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] AbhiKansara.Core.Entities.Service service)
    {
        // Assign a fresh Id for the root entity
        service.Id = Guid.NewGuid();

        // Wire FK references for all nested collections so EF Core model validation passes
        foreach (var package in service.Packages)
        {
            package.Id = Guid.NewGuid();
            package.ServiceId = service.Id;
            package.Service = service;

            foreach (var deliverable in package.Deliverables)
            {
                deliverable.Id = Guid.NewGuid();
                deliverable.ServicePackageId = package.Id;
                deliverable.ServicePackage = package;
            }
        }

        foreach (var addOn in service.AddOns)
        {
            addOn.Id = Guid.NewGuid();
            addOn.ServiceId = service.Id;
            addOn.Service = service;
        }

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
    /// Manually wires FK navigation references to bypass EF Core model validation.
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

        // Remove all existing nested collections — full replace strategy
        _context.RemoveRange(existingService.Packages.SelectMany(p => p.Deliverables));
        _context.RemoveRange(existingService.Packages);
        _context.RemoveRange(existingService.AddOns);
        _context.RemoveRange(existingService.ProcessSteps);
        _context.RemoveRange(existingService.Testimonials);
        _context.RemoveRange(existingService.FAQs);

        await _context.SaveChangesAsync(); // Flush deletes before re-adding

        // Update scalar fields
        _context.Entry(existingService).CurrentValues.SetValues(updatedService);

        // Wire FK references for incoming nested items
        foreach (var package in updatedService.Packages)
        {
            package.Id = Guid.NewGuid();
            package.ServiceId = id;
            package.Service = existingService;

            foreach (var deliverable in package.Deliverables)
            {
                deliverable.Id = Guid.NewGuid();
                deliverable.ServicePackageId = package.Id;
                deliverable.ServicePackage = package;
            }
        }

        foreach (var addOn in updatedService.AddOns)
        {
            addOn.Id = Guid.NewGuid();
            addOn.ServiceId = id;
            addOn.Service = existingService;
        }

        foreach (var step in updatedService.ProcessSteps)
        {
            step.Id = Guid.NewGuid();
            step.ServiceId = id;
            step.Service = existingService;
        }

        foreach (var testimonial in updatedService.Testimonials)
        {
            testimonial.Id = Guid.NewGuid();
            testimonial.ServiceId = id;
            testimonial.Service = existingService;
        }

        foreach (var faq in updatedService.FAQs)
        {
            faq.Id = Guid.NewGuid();
            faq.ServiceId = id;
            faq.Service = existingService;
        }

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
