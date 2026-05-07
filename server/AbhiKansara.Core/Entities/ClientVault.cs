using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Represents a private client vault — a curated set of photos/videos
/// delivered to a specific client after a shoot.
/// Links to a SmugMug Album for the actual media storage.
/// </summary>
public class ClientVault : BaseEntity
{
    public required string Title { get; set; }              // e.g., "Aaina & Daideep — Wedding Gallery"
    public string? Description { get; set; }
    public string? SmugMugAlbumId { get; set; }             // SmugMug Album identifier
    public string? SmugMugAlbumKey { get; set; }            // SmugMug Album key
    public string? CoverImageUrl { get; set; }
    public DateTime? ShootDate { get; set; }
    public string? AccessCode { get; set; }                 // Optional shareable access code
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }                // Optional expiry for the vault

    // ── Navigation ──
    public ICollection<UserVaultAccess> AuthorizedUsers { get; set; } = new List<UserVaultAccess>();
}
