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
}
