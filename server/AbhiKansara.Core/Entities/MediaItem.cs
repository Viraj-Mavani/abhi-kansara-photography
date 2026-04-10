using AbhiKansara.Core.Common;
using AbhiKansara.Core.Enums;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// A single photo or video within a ProjectGallery.
/// Maps to the MediaItem interface in lib/portfolio.ts.
/// Caches dimensional metadata locally for the Bento grid layout.
/// </summary>
public class MediaItem : BaseEntity
{
    public MediaType Type { get; set; }              // Photo or Video

    public required string Url { get; set; }         // Primary URL (image src or video source)
    public int Width { get; set; }                   // Original width — essential for justified grid math
    public int Height { get; set; }                  // Original height — essential for justified grid math
    public string? Alt { get; set; }                 // Accessibility alt text

    // ── Video-specific fields ──
    public string? PosterUrl { get; set; }           // Thumbnail for videos
    public string? HlsUrl { get; set; }              // HLS stream URL (.m3u8)
    public string? Duration { get; set; }            // e.g., "2:35"

    // ── SmugMug metadata (future sync) ──
    public string? SmugMugImageKey { get; set; }     // For linking back to SmugMug
    public double? AspectRatio { get; set; }         // Pre-calculated Width/Height

    public int Order { get; set; }

    // ── Foreign Key ──
    public Guid ProjectGalleryId { get; set; }
    public ProjectGallery ProjectGallery { get; set; } = null!;
}
