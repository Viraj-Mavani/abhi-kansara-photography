using AbhiKansara.Core.Common;

namespace AbhiKansara.Core.Entities;

/// <summary>
/// Root entity for a photography service offering.
/// Maps to the DetailedService interface in the frontend (lib/services.ts).
/// One Service has many Packages, AddOns, Process steps, Testimonials, and FAQs.
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

    // ── Pricing ──
    public string? StartingPrice { get; set; }   // e.g., "$3,500"
    public string? PriceNote { get; set; }        // e.g., "Starting from"

    // ── Features & Highlights (stored as JSON arrays for flexibility) ──
    public List<string> Features { get; set; } = new();
    public List<string> Highlights { get; set; } = new();

    // ── Gallery Images (URLs for the service's portfolio) ──
    public List<string> GalleryImages { get; set; } = new();

    // ── Tags (for filtering) ──
    public List<string> Tags { get; set; } = new();

    // ── Metadata ──
    public string? Category { get; set; }         // "Wedding", "Corporate" — plain string
    public string? MinDuration { get; set; }
    public string? MaxCapacity { get; set; }
    public bool TravelAvailable { get; set; }
    public string? IndoorOutdoor { get; set; }    // "Indoor", "Outdoor", "Both" — plain string

    // ── Display ──
    public int Order { get; set; }
    public bool IsFeatured { get; set; }

    // ── Navigation Properties (One-to-Many) ──
    public ICollection<ServicePackage> Packages { get; set; } = new List<ServicePackage>();
    public ICollection<ServiceAddOn> AddOns { get; set; } = new List<ServiceAddOn>();
    public ICollection<ServiceProcess> ProcessSteps { get; set; } = new List<ServiceProcess>();
    public ICollection<ServiceTestimonial> Testimonials { get; set; } = new List<ServiceTestimonial>();
    public ICollection<ServiceFAQ> FAQs { get; set; } = new List<ServiceFAQ>();
}
