using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// An optional add-on/extra that can accompany a service (e.g., "Extra Hour", "Rush Delivery").
/// Maps to the ServiceAddOn interface in lib/services.ts.
/// </summary>
public class ServiceAddOn : BaseEntity
{
    public required string Name { get; set; }
    public string? Price { get; set; }
    public string? Description { get; set; }
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;
}
