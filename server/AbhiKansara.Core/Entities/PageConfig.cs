using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Reusable page-level configuration entity.
/// Stores hero text, CTA, and section titles for pages like /services and /portfolio.
/// Each row represents one page's config, identified by PageKey (e.g., "services", "portfolio").
/// </summary>
public class PageConfig : BaseEntity
{
    public required string PageKey { get; set; }       // Unique key: "services", "portfolio", "home"
    public required string HeroTagline { get; set; }
    public required string HeroTitle { get; set; }
    public required string HeroSubtitle { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }

    // ── Optional section headers (for pages like services) ──
    public string? SectionTitle1 { get; set; }         // e.g., "How We Work"
    public string? SectionSubtitle1 { get; set; }
    public string? SectionTitle2 { get; set; }         // e.g., "Questions & Answers"
    public string? SectionSubtitle2 { get; set; }
}
