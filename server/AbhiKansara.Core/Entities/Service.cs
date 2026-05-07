using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Root entity for a photography service offering.
/// Maps to the DetailedService interface in the frontend (lib/api.ts).
/// One Service has many Process steps, Testimonials, and FAQs.
/// </summary>
public class Service : BaseEntity
{
    // ── Core ──
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string Tagline { get; set; }
    public required string CoverImage { get; set; }
    public string? Icon { get; set; } // Material Symbols icon name

    // ── Descriptions ──
    public required string ShortDescription { get; set; }
    public required string DetailedDescription { get; set; }

    // ── Content (stored as JSON arrays) ──
    public List<string> Features { get; set; } = new();
    public List<string> Highlights { get; set; } = new();

    // ── Gallery Images (URLs for the service's portfolio) ──
    public List<string> GalleryImages { get; set; } = new();

    // ── Metadata & Display (Simplified) ──
    public string? Category { get; set; }         // "Wedding", "Corporate", etc.
    public int Order { get; set; }
    public bool IsFeatured { get; set; }

    // ── Navigation Properties (One-to-Many) ──
    // Note: Packages and AddOns removed per simplification request.
    public ICollection<ServiceProcess> ProcessSteps { get; set; } = new List<ServiceProcess>();
    public ICollection<ServiceTestimonial> Testimonials { get; set; } = new List<ServiceTestimonial>();
    public ICollection<ServiceFAQ> FAQs { get; set; } = new List<ServiceFAQ>();
}
