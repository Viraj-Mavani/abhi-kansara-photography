using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Represents a full-screen background image for the landing page hero section.
/// Managed via the Admin CMS to enable dynamic "Hero Manager" functionality.
/// </summary>
public class HeroBackground : BaseEntity
{
    public required string ImageUrl { get; set; }
    public string? AltText { get; set; }
    public int Order { get; set; }
}
