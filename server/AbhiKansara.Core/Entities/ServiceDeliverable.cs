using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A single deliverable item within a package (e.g., "500+ Edited Photos").
/// Maps to the ServiceDeliverable interface in lib/services.ts.
/// </summary>
public class ServiceDeliverable : BaseEntity
{
    public required string Item { get; set; }
    public string? Detail { get; set; }  // e.g., "Edited in Lightroom & Photoshop"
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServicePackageId { get; set; }
    public ServicePackage ServicePackage { get; set; } = null!;
}
