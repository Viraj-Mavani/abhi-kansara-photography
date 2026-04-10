using AbhiKansara.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbhiKansara.API.Controllers;

/// <summary>
/// Public API for site-level configuration (bio, page heroes, etc.).
/// These are the dynamic CMS-like settings that the admin can change.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SiteConfigController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SiteConfigController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/siteconfig/bio
    /// Returns the artist bio/about data (single record).
    /// </summary>
    [HttpGet("bio")]
    public async Task<IActionResult> GetBio()
    {
        var bio = await _context.SiteBios
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (bio is null)
            return NotFound(new { message = "Site bio not configured." });

        return Ok(bio);
    }

    /// <summary>
    /// GET /api/siteconfig/page/{pageKey}
    /// Returns the page configuration (hero text, CTA, section titles) for a specific page.
    /// Example: /api/siteconfig/page/services
    /// </summary>
    [HttpGet("page/{pageKey}")]
    public async Task<IActionResult> GetPageConfig(string pageKey)
    {
        var config = await _context.PageConfigs
            .Where(p => p.PageKey == pageKey)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (config is null)
            return NotFound(new { message = $"Page config for '{pageKey}' not found." });

        return Ok(config);
    }

    /// <summary>
    /// GET /api/siteconfig/pages
    /// Returns all page configurations.
    /// </summary>
    [HttpGet("pages")]
    public async Task<IActionResult> GetAllPageConfigs()
    {
        var configs = await _context.PageConfigs
            .AsNoTracking()
            .ToListAsync();

        return Ok(configs);
    }
}
