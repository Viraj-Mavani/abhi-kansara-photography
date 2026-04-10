using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A pricing package/tier within a Service (e.g., "Essential", "Signature", "Luxury").
/// Maps to the ServicePackage interface in lib/services.ts.
/// One ServicePackage has many ServiceDeliverables.
/// </summary>
public class ServicePackage : BaseEntity
{
    public required string Name { get; set; }        // e.g., "Signature"
    public string? Price { get; set; }               // e.g., "$5,500"
    public string? PriceNote { get; set; }           // e.g., "Most Popular"
    public string? Duration { get; set; }            // e.g., "10 Hours"
    public string? Description { get; set; }
    public bool IsPopular { get; set; }
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;

    // ── Navigation ──
    public ICollection<ServiceDeliverable> Deliverables { get; set; } = new List<ServiceDeliverable>();
}
