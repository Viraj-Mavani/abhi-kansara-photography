using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Dynamic site biography/about content.
/// Maps to lib/bio.ts — allows the admin to update artist info via CMS.
/// Singleton-like: only one active row expected.
/// </summary>
public class SiteBio : BaseEntity
{
    public required string ArtistName { get; set; }
    public required string Tagline { get; set; }
    public required string Intro { get; set; }
    public required string History { get; set; }
    public required string Philosophy { get; set; }
    public required string PortraitImage { get; set; }  // URL to portrait photo
}
