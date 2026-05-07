using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A client photography gallery/project (e.g., "Aaina & Daideep — Wedding").
/// Maps to the Gallery interface in lib/portfolio.ts.
/// One ProjectGallery has many MediaItems.
/// </summary>
public class ProjectGallery : BaseEntity
{
    public required string Slug { get; set; }             // URL-friendly: "aaina-daideep"
    public required string ClientName { get; set; }       // "Aaina & Daideep"
    public required string Category { get; set; }         // "Wedding", "Pre-Wedding" — plain string
    public required string CoverPhotoUrl { get; set; }
    public DateTime? ShootDate { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public bool IsFeatured { get; set; }
    public int Order { get; set; }

    // ── SmugMug Integration (optional — populated when linked) ──
    /// <summary>SmugMug Album ID extracted from the album URL (e.g. "n-AbCd12")</summary>
    public string? SmugMugAlbumId { get; set; }
    /// <summary>SmugMug Album Key used in API v2 calls</summary>
    public string? SmugMugAlbumKey { get; set; }
    /// <summary>Timestamp of the last successful SmugMug sync (null = never synced)</summary>
    public DateTimeOffset? LastSmugMugSync { get; set; }

    // ── Navigation ──
    public ICollection<MediaItem> Media { get; set; } = new List<MediaItem>();
}
