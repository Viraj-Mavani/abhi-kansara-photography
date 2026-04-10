using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Join table mapping an ApplicationUser to a ClientVault.
/// Enables RBAC: when "Client A" logs in, we query this table
/// to find which vaults they're authorized to view.
/// </summary>
public class UserVaultAccess : BaseEntity
{
    // ── Foreign Key to ApplicationUser (Guid, defined in Infrastructure) ──
    public Guid UserId { get; set; }

    // ── Foreign Key to ClientVault ──
    public Guid ClientVaultId { get; set; }
    public ClientVault ClientVault { get; set; } = null!;

    // ── Access metadata ──
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public string? GrantedBy { get; set; }    // Admin who granted access
}
