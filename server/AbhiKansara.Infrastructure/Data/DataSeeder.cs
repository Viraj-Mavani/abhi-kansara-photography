using AbhiKansara.Core.Entities;
using AbhiKansara.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AbhiKansara.Infrastructure.Data;

/// <summary>
/// Seeds the database with the existing frontend data,
/// simplified for the new minimalist Services model.
/// </summary>
public static class DataSeeder
{
    private const string R2_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        await SeedServicesAsync(context, logger);
        await SeedGalleriesAsync(context, logger);
        await SeedSiteBioAsync(context, logger);
        await SeedPageConfigsAsync(context, logger);
        await SeedCarouselItemsAsync(context, logger);
    }

    private static async Task SeedServicesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Services.AnyAsync())
        {
            logger.LogInformation("Services table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding Services (Simplified)...");

        var services = new List<Service>
        {
            new Service
            {
                Slug = "wedding",
                Title = "Wedding Photography",
                Tagline = "Your love story, told through light",
                CoverImage = $"{R2_URL}/images/coverImages/cover0.webp",
                Icon = "favorite",
                ShortDescription = "Timeless, cinematic wedding coverage that captures every stolen glance, joyful tear, and spontaneous dance move.",
                DetailedDescription = "We approach every wedding as a once-in-a-lifetime narrative. From the quiet intimacy of getting ready to the electric energy of the reception, our dual-photographer setup ensures no moment goes unnoticed. We blend photojournalistic candids with carefully composed editorial shots, delivering a gallery that feels like flipping through the pages of a luxury magazine.",
                Features = new List<string>
                {
                    "Dual Photographer Coverage",
                    "Engagement Session Included",
                    "Custom Online Gallery",
                    "Cinematic Colour Grading",
                    "High-Resolution Digital Files"
                },
                Highlights = new List<string>
                {
                    "500+ Edited Photos",
                    "8–12 Hour Coverage",
                    "48hr Sneak Peek Delivery"
                },
                GalleryImages = new List<string>
                {
                    $"{R2_URL}/images/work/work0.webp",
                    $"{R2_URL}/images/work/work4.webp",
                    $"{R2_URL}/images/work/work11.webp"
                },
                Category = "Wedding",
                Order = 1,
                IsFeatured = true,
                ProcessSteps = new List<ServiceProcess>
                {
                    new ServiceProcess { StepNumber = 1, Title = "Discovery Call", Description = "We get to know your vision and timeline.", Icon = "call", Order = 1 },
                    new ServiceProcess { StepNumber = 2, Title = "The Big Day", Description = "We arrive early and capture everything authentically.", Icon = "camera", Order = 2 },
                    new ServiceProcess { StepNumber = 3, Title = "Delivery", Description = "Hand-edited gallery delivered via your private online portal.", Icon = "photo_library", Order = 3 }
                },
                Testimonials = new List<ServiceTestimonial>
                {
                    new ServiceTestimonial { ClientName = "Priya & Arjun", Event = "Wedding", Quote = "Abhi didn't just photograph our wedding — he captured the feeling of it.", Rating = 5, Order = 1 }
                },
                FAQs = new List<ServiceFAQ>
                {
                    new ServiceFAQ { Question = "How far in advance should we book?", Answer = "We recommend booking 6–12 months in advance.", Order = 1 }
                }
            },
            new Service
            {
                Slug = "events",
                Title = "Event Coverage",
                Tagline = "The energy, the crowd, the spectacle",
                CoverImage = $"{R2_URL}/images/coverImages/cover1.webp",
                Icon = "celebration",
                ShortDescription = "From corporate galas to live concerts, we document the pulse and personality of every event.",
                DetailedDescription = "Events move fast — and so do we. Our event photography is built around anticipation, positioning, and storytelling. We deliver imagery that captures the atmosphere and the key moments.",
                Features = new List<string> { "Fast Turnaround", "Multi-Angle Coverage", "Social-Media Ready" },
                GalleryImages = new List<string> { $"{R2_URL}/images/work/work1.webp", $"{R2_URL}/images/work/work6.webp" },
                Category = "Events",
                Order = 2,
                IsFeatured = true
            },
            new Service
            {
                Slug = "product",
                Title = "Product Photography",
                Tagline = "Elevate your brand, frame by frame",
                CoverImage = $"{R2_URL}/images/coverImages/cover2.webp",
                Icon = "diamond",
                ShortDescription = "High-end product photography that transforms everyday objects into objects of desire.",
                DetailedDescription = "Great products deserve imagery that sells. We specialise in studio and lifestyle product photography that elevates brands.",
                Features = new List<string> { "Studio & On-Location", "E-Commerce White Background", "Colour-Accurate" },
                GalleryImages = new List<string> { $"{R2_URL}/images/work/work2.webp" },
                Category = "Commercial",
                Order = 3,
                IsFeatured = false
            },
            new Service
            {
                Slug = "portrait",
                Title = "Portrait Sessions",
                Tagline = "Your story, your light, your moment",
                CoverImage = $"{R2_URL}/images/coverImages/cover3.webp",
                Icon = "person",
                ShortDescription = "Expressive, editorial-style portraits for individuals and creative professionals.",
                DetailedDescription = "A great portrait goes beyond a pose — it reveals personality. We create images that feel authentic and elevated.",
                Features = new List<string> { "Professional Posing Direction", "Skin Retouching", "Multiple Outfits" },
                GalleryImages = new List<string> { $"{R2_URL}/images/work/work3.webp", $"{R2_URL}/images/work/work5.webp" },
                Category = "Portrait",
                Order = 4,
                IsFeatured = true
            }
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} services successfully.", services.Count);
    }

    private static async Task SeedGalleriesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.ProjectGalleries.AnyAsync())
        {
            logger.LogInformation("ProjectGalleries table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding Galleries...");

        var galleries = new List<ProjectGallery>
        {
            new ProjectGallery
            {
                Slug = "aaina-daideep",
                ClientName = "Aaina & Daideep",
                Category = "Wedding",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature0.webp",
                ShootDate = new DateTime(2024, 12, 15, 0, 0, 0, DateTimeKind.Utc),
                Location = "Udaipur, India",
                Description = "A magical winter wedding set against the regal backdrop of Udaipur.",
                IsFeatured = true,
                Order = 1,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature0.webp", Width = 1200, Height = 1800, Alt = "Bride portrait", AspectRatio = 1200.0/1800.0, Order = 1 }
                }
            }
        };

        context.ProjectGalleries.AddRange(galleries);
        await context.SaveChangesAsync();
    }

    private static async Task SeedSiteBioAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.SiteBios.AnyAsync()) return;
        var bio = new SiteBio
        {
            ArtistName = "Abhi Kansara",
            Tagline = "I believe in the beauty of unscripted moments.",
            Intro = "My approach is deeply rooted in editorial elegance and raw, emotional authenticity.",
            History = "Based in India and traveling worldwide, I've spent the last decade documenting love stories.",
            Philosophy = "To photograph truthfully and effectively is to see beneath the surfaces.",
            PortraitImage = $"{R2_URL}/images/Abhi.webp"
        };
        context.SiteBios.Add(bio);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPageConfigsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.PageConfigs.AnyAsync()) return;
        var configs = new List<PageConfig>
        {
            new PageConfig
            {
                PageKey = "services",
                HeroTagline = "Experiences",
                HeroTitle = "Crafted with Intention",
                HeroSubtitle = "Every frame tells a story.",
                CtaText = "Book a Consultation",
                CtaLink = "/contact"
            },
            new PageConfig
            {
                PageKey = "portfolio",
                HeroTagline = "Portfolio",
                HeroTitle = "Our Work",
                HeroSubtitle = "A curated collection of moments and stories."
            }
        };
        context.PageConfigs.AddRange(configs);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCarouselItemsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.CarouselItems.AnyAsync()) return;
        var items = new List<CarouselItem>
        {
            new CarouselItem { SortOrder = 1, Title = "Wedding", ImageUrl = $"{R2_URL}/images/work/work0.webp" },
            new CarouselItem { SortOrder = 2, Title = "Event", ImageUrl = $"{R2_URL}/images/work/work1.webp" }
        };
        context.CarouselItems.AddRange(items);
        await context.SaveChangesAsync();
    }
}
