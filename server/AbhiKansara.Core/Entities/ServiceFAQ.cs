using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A frequently asked question for a specific service.
/// Maps to the ServiceFAQ interface in lib/services.ts.
/// </summary>
public class ServiceFAQ : BaseEntity
{
    public required string Question { get; set; }
    public required string Answer { get; set; }
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServiceId { get; set; }
    public Service? Service { get; set; }
}
