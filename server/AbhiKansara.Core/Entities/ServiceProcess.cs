using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A step in the service's booking/working process (e.g., Step 1: "Discovery Call").
/// Maps to the ServiceProcess interface in lib/services.ts.
/// </summary>
public class ServiceProcess : BaseEntity
{
    public int StepNumber { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? Icon { get; set; }  // Material Symbols icon name
    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ServiceId { get; set; }
    public Service? Service { get; set; }
}
