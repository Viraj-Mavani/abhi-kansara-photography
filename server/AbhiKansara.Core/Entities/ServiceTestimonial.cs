using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A client testimonial/review linked to a specific service.
/// Maps to the ServiceTestimonial interface in lib/services.ts.
/// </summary>
public class ServiceTestimonial : BaseEntity
{
    public required string ClientName { get; set; }
    public string? Event { get; set; }       // e.g., "Wedding — January 2025"
    public required string Quote { get; set; }
    public int? Rating { get; set; }         // 1–5
    public string? Avatar { get; set; }      // URL to client avatar
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;
}
