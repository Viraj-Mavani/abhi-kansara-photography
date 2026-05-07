namespace AbhiKansara.Core.Common;

/// <summary>
/// Base class for all domain entities. Provides a consistent primary key
/// and audit timestamps that EF Core will manage automatically.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
