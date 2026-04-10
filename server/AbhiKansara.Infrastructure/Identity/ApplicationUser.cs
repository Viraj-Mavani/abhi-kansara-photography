using Microsoft.AspNetCore.Identity;

namespace AbhiKansara.Infrastructure.Identity;

/// <summary>
/// Custom Identity user with Guid primary key.
/// Extends the default IdentityUser with photography-specific fields.
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
