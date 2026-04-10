using AbhiKansara.Core.Entities;
using AbhiKansara.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AbhiKansara.Infrastructure.Data;

/// <summary>
/// Seeds the database with the existing frontend data from lib/services.ts,
/// lib/portfolio.ts, and lib/bio.ts. Runs once when the database tables are empty.
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

    // ────────────────────────────────────────────────────────
    //  SERVICES (from lib/services.ts)
    // ────────────────────────────────────────────────────────

    private static async Task SeedServicesAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Services.AnyAsync())
        {
            logger.LogInformation("Services table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding Services...");

        var services = new List<Service>
        {
            // ── 1. Wedding Photography ──
            new Service
            {
                Slug = "wedding",
                Title = "Wedding Photography",
                Tagline = "Your love story, told through light",
                CoverImage = $"{R2_URL}/images/coverImages/cover0.webp",
                Icon = "favorite",
                ShortDescription = "Timeless, cinematic wedding coverage that captures every stolen glance, joyful tear, and spontaneous dance move — so you can relive the magic for generations.",
                DetailedDescription = "We approach every wedding as a once-in-a-lifetime narrative. From the quiet intimacy of getting ready to the electric energy of the reception, our dual-photographer setup ensures no moment goes unnoticed. We blend photojournalistic candids with carefully composed editorial shots, delivering a gallery that feels like flipping through the pages of a luxury magazine. Our post-production process includes colour-grading tailored to the venue's light, skin-tone perfection, and a cinematic consistency across every frame.",
                StartingPrice = "$3,500",
                PriceNote = "Starting from",
                Features = new List<string>
                {
                    "Dual Photographer Coverage",
                    "Engagement Session Included",
                    "Custom Online Gallery",
                    "Cinematic Colour Grading",
                    "Drone Aerial Shots",
                    "Same-Day Sneak Peeks",
                    "High-Resolution Digital Files",
                    "Print Release Included"
                },
                Highlights = new List<string>
                {
                    "500+ Edited Photos",
                    "8–12 Hour Coverage",
                    "48hr Sneak Peek Delivery",
                    "4–6 Week Full Delivery"
                },
                GalleryImages = new List<string>
                {
                    $"{R2_URL}/images/work/work0.webp",
                    $"{R2_URL}/images/work/work4.webp",
                    $"{R2_URL}/images/work/work11.webp",
                    $"{R2_URL}/images/feature/feature0.webp",
                    $"{R2_URL}/images/feature/feature1.webp",
                    $"{R2_URL}/images/feature/feature3.webp"
                },
                Tags = new List<string> { "wedding", "bridal", "ceremony", "reception", "engagement" },
                Category = "Wedding",
                MinDuration = "6 Hours",
                TravelAvailable = true,
                IndoorOutdoor = "Both",
                Order = 1,
                IsFeatured = true,
                Packages = new List<ServicePackage>
                {
                    new ServicePackage
                    {
                        Name = "Essential", Price = "$3,500", PriceNote = "Starting from",
                        Duration = "6 Hours",
                        Description = "Perfect for intimate ceremonies and elopements.",
                        Order = 1,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "One Lead Photographer", Order = 1 },
                            new ServiceDeliverable { Item = "300+ Edited Photos", Order = 2 },
                            new ServiceDeliverable { Item = "Online Gallery", Detail = "Password-protected", Order = 3 },
                            new ServiceDeliverable { Item = "High-Resolution Downloads", Order = 4 },
                            new ServiceDeliverable { Item = "Print Release", Order = 5 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Signature", Price = "$5,500", PriceNote = "Most Popular",
                        Duration = "10 Hours",
                        Description = "Our most-loved package for full-day celebrations.",
                        IsPopular = true, Order = 2,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Two Photographers", Order = 1 },
                            new ServiceDeliverable { Item = "500+ Edited Photos", Order = 2 },
                            new ServiceDeliverable { Item = "Engagement Session", Order = 3 },
                            new ServiceDeliverable { Item = "Same-Day Sneak Peeks", Order = 4 },
                            new ServiceDeliverable { Item = "Drone Coverage", Order = 5 },
                            new ServiceDeliverable { Item = "Custom Online Gallery", Order = 6 },
                            new ServiceDeliverable { Item = "Print Release", Order = 7 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Luxury", Price = "$8,000", PriceNote = "All-Inclusive",
                        Duration = "Full Day + After-Party",
                        Description = "The ultimate experience — every detail, every moment.",
                        Order = 3,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Two Photographers + Assistant", Order = 1 },
                            new ServiceDeliverable { Item = "700+ Edited Photos", Order = 2 },
                            new ServiceDeliverable { Item = "Engagement + Pre-Wedding Session", Order = 3 },
                            new ServiceDeliverable { Item = "Bridal Portrait Session", Order = 4 },
                            new ServiceDeliverable { Item = "Premium Leather Album", Detail = "40 pages", Order = 5 },
                            new ServiceDeliverable { Item = "Canvas Wall Art", Detail = "24×36 inch", Order = 6 },
                            new ServiceDeliverable { Item = "Same-Day Slideshow", Order = 7 },
                            new ServiceDeliverable { Item = "Drone + Cinematic Coverage", Order = 8 }
                        }
                    }
                },
                AddOns = new List<ServiceAddOn>
                {
                    new ServiceAddOn { Name = "Extra Hour", Price = "$400", Description = "Extend your coverage", Order = 1 },
                    new ServiceAddOn { Name = "Second Shooter", Price = "$600", Description = "Additional angle coverage", Order = 2 },
                    new ServiceAddOn { Name = "Photo Album", Price = "$800", Description = "Hand-crafted premium album", Order = 3 },
                    new ServiceAddOn { Name = "Rush Delivery", Price = "$500", Description = "Gallery within 2 weeks", Order = 4 }
                },
                ProcessSteps = new List<ServiceProcess>
                {
                    new ServiceProcess { StepNumber = 1, Title = "Discovery Call", Description = "We get to know your vision, venue, and timeline over a friendly call.", Icon = "call", Order = 1 },
                    new ServiceProcess { StepNumber = 2, Title = "Proposal & Booking", Description = "Receive a tailored proposal. Secure your date with a retainer.", Icon = "description", Order = 2 },
                    new ServiceProcess { StepNumber = 3, Title = "Pre-Wedding Planning", Description = "Location scouts, timeline reviews, and a complimentary engagement shoot.", Icon = "calendar_month", Order = 3 },
                    new ServiceProcess { StepNumber = 4, Title = "The Big Day", Description = "We arrive early, blend in, and capture everything authentically.", Icon = "camera", Order = 4 },
                    new ServiceProcess { StepNumber = 5, Title = "Curation & Delivery", Description = "Hand-edited gallery delivered via your private online portal.", Icon = "photo_library", Order = 5 }
                },
                Testimonials = new List<ServiceTestimonial>
                {
                    new ServiceTestimonial { ClientName = "Priya & Arjun", Event = "Wedding — January 2025", Quote = "Abhi didn't just photograph our wedding — he captured the feeling of it. Every image transports us right back to that day.", Rating = 5, Order = 1 },
                    new ServiceTestimonial { ClientName = "Meera & Raj", Event = "Wedding — March 2024", Quote = "The team was invisible yet everywhere. We were blown away by the final gallery.", Rating = 5, Order = 2 }
                },
                FAQs = new List<ServiceFAQ>
                {
                    new ServiceFAQ { Question = "How far in advance should we book?", Answer = "We recommend booking 6–12 months in advance, especially for peak wedding season. However, we occasionally have last-minute availability.", Order = 1 },
                    new ServiceFAQ { Question = "Do you travel for destination weddings?", Answer = "Absolutely! We love destination weddings. Travel fees vary by location — reach out for a custom quote.", Order = 2 },
                    new ServiceFAQ { Question = "When will we receive our photos?", Answer = "You'll receive same-day sneak peeks within 48 hours. The full gallery is typically delivered within 4–6 weeks.", Order = 3 },
                    new ServiceFAQ { Question = "Can we request specific shots?", Answer = "Of course. We'll work with you on a shot list beforehand while still leaving room for spontaneous magic.", Order = 4 }
                }
            },

            // ── 2. Event Coverage ──
            new Service
            {
                Slug = "events",
                Title = "Event Coverage",
                Tagline = "The energy, the crowd, the spectacle",
                CoverImage = $"{R2_URL}/images/coverImages/cover1.webp",
                Icon = "celebration",
                ShortDescription = "From corporate galas to live concerts, we document the pulse and personality of every event with editorial precision.",
                DetailedDescription = "Events move fast — and so do we. Our event photography is built around anticipation, positioning, and storytelling. Whether it's a 50-person corporate dinner or a 5,000-seat concert, we deliver imagery that captures the atmosphere, the key moments, and the human connections that make each event unique. Our fast turnaround means your marketing team or event organiser gets publishable content within days, not months.",
                StartingPrice = "$1,200",
                PriceNote = "Starting from",
                Features = new List<string>
                {
                    "Fast Turnaround (48–72hrs)",
                    "Multi-Angle Coverage",
                    "On-Site Selection Preview",
                    "Social-Media Ready Crops",
                    "High-Resolution Delivery",
                    "Red Carpet & Stage Coverage"
                },
                GalleryImages = new List<string>
                {
                    $"{R2_URL}/images/work/work1.webp",
                    $"{R2_URL}/images/work/work6.webp",
                    $"{R2_URL}/images/work/work7.webp",
                    $"{R2_URL}/images/work/work8.webp",
                    $"{R2_URL}/images/feature/feature2.webp"
                },
                Tags = new List<string> { "corporate", "concert", "gala", "conference", "festival" },
                Category = "Events",
                MinDuration = "4 Hours",
                TravelAvailable = true,
                IndoorOutdoor = "Both",
                Order = 2,
                IsFeatured = true,
                Packages = new List<ServicePackage>
                {
                    new ServicePackage
                    {
                        Name = "Half Day", Price = "$1,200", Duration = "4 Hours",
                        Description = "Ideal for corporate networking events and small gatherings.",
                        Order = 1,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "One Photographer", Order = 1 },
                            new ServiceDeliverable { Item = "150+ Edited Photos", Order = 2 },
                            new ServiceDeliverable { Item = "48-Hour Delivery", Order = 3 },
                            new ServiceDeliverable { Item = "Social Media Crops", Order = 4 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Full Day", Price = "$2,200", Duration = "8 Hours",
                        Description = "Comprehensive coverage for conferences, galas, or festivals.",
                        IsPopular = true, Order = 2,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Two Photographers", Order = 1 },
                            new ServiceDeliverable { Item = "350+ Edited Photos", Order = 2 },
                            new ServiceDeliverable { Item = "Same-Day Highlights", Detail = "5 edited shots within 3 hours", Order = 3 },
                            new ServiceDeliverable { Item = "Custom Online Gallery", Order = 4 },
                            new ServiceDeliverable { Item = "Print Release", Order = 5 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Multi-Day", Price = "Custom", PriceNote = "Get a Quote",
                        Duration = "2+ Days",
                        Description = "For festivals, multi-day conferences, or concert series.",
                        Order = 3,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Dedicated Photography Team", Order = 1 },
                            new ServiceDeliverable { Item = "Daily Highlight Delivery", Order = 2 },
                            new ServiceDeliverable { Item = "On-Site Editing Station", Order = 3 },
                            new ServiceDeliverable { Item = "Social-Media Content Strategy", Order = 4 },
                            new ServiceDeliverable { Item = "Event Recap Video Stills", Order = 5 }
                        }
                    }
                },
                ProcessSteps = new List<ServiceProcess>
                {
                    new ServiceProcess { StepNumber = 1, Title = "Briefing", Description = "Understand the event agenda, branding, and key stakeholders.", Icon = "groups", Order = 1 },
                    new ServiceProcess { StepNumber = 2, Title = "Site Recce", Description = "Visit the venue to plan lighting, angles, and logistics.", Icon = "location_on", Order = 2 },
                    new ServiceProcess { StepNumber = 3, Title = "Capture", Description = "On the day — discreet, professional, and thorough.", Icon = "camera", Order = 3 },
                    new ServiceProcess { StepNumber = 4, Title = "Fast Delivery", Description = "Curated gallery delivered within 48–72 hours.", Icon = "bolt", Order = 4 }
                },
                FAQs = new List<ServiceFAQ>
                {
                    new ServiceFAQ { Question = "Can you provide same-day photos for social media?", Answer = "Yes! We can deliver 5–10 edited highlights within a few hours of the event for immediate posting.", Order = 1 },
                    new ServiceFAQ { Question = "Do you cover corporate branding requirements?", Answer = "Absolutely. We follow brand guidelines for composition, ensuring logos and backdrops are featured appropriately.", Order = 2 },
                    new ServiceFAQ { Question = "What about low-light venues?", Answer = "We use professional-grade low-light equipment and off-camera lighting to produce stunning results in any environment.", Order = 3 }
                }
            },

            // ── 3. Product Photography ──
            new Service
            {
                Slug = "product",
                Title = "Product Photography",
                Tagline = "Elevate your brand, frame by frame",
                CoverImage = $"{R2_URL}/images/coverImages/cover2.webp",
                Icon = "diamond",
                ShortDescription = "High-end product and commercial photography that transforms everyday objects into objects of desire.",
                DetailedDescription = "Great products deserve imagery that sells. We specialise in studio and lifestyle product photography that elevates brands across e-commerce, social media, and print. From moody flat-lays to crisp packshots on white, every shoot is art-directed in collaboration with your creative team. We handle everything — styling, props, lighting rigs, and colour-accurate post-production — so your products look irresistible on every screen.",
                StartingPrice = "$800",
                PriceNote = "Per session",
                Features = new List<string>
                {
                    "Studio & On-Location",
                    "E-Commerce White Background",
                    "Lifestyle Contextual Shots",
                    "Flat-Lay & Hero Compositions",
                    "Colour-Accurate Editing",
                    "Multi-Platform Crops (Web, Social, Print)"
                },
                GalleryImages = new List<string>
                {
                    $"{R2_URL}/images/work/work2.webp",
                    $"{R2_URL}/images/feature/feature4.webp"
                },
                Tags = new List<string> { "product", "ecommerce", "brand", "commercial", "studio" },
                Category = "Commercial",
                MinDuration = "Half Day",
                TravelAvailable = false,
                IndoorOutdoor = "Indoor",
                Order = 3,
                IsFeatured = false,
                Packages = new List<ServicePackage>
                {
                    new ServicePackage
                    {
                        Name = "Starter", Price = "$800", Duration = "Half Day",
                        Description = "Up to 10 products with clean studio shots.",
                        Order = 1,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "10 Products", Order = 1 },
                            new ServiceDeliverable { Item = "3 Angles Per Product", Order = 2 },
                            new ServiceDeliverable { Item = "White Background Packshots", Order = 3 },
                            new ServiceDeliverable { Item = "High-Resolution Files", Order = 4 },
                            new ServiceDeliverable { Item = "Web-Optimised Exports", Order = 5 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Brand Builder", Price = "$1,800", Duration = "Full Day",
                        Description = "Up to 25 products with lifestyle and studio shots.",
                        IsPopular = true, Order = 2,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "25 Products", Order = 1 },
                            new ServiceDeliverable { Item = "Studio + Lifestyle Shots", Order = 2 },
                            new ServiceDeliverable { Item = "Flat-Lay Compositions", Order = 3 },
                            new ServiceDeliverable { Item = "Social Media Crops", Order = 4 },
                            new ServiceDeliverable { Item = "Art Direction Included", Order = 5 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Campaign", Price = "Custom", PriceNote = "Let's Talk",
                        Duration = "Multi-Day",
                        Description = "Full creative campaign — lookbooks, hero images, and more.",
                        Order = 3,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Unlimited Products", Order = 1 },
                            new ServiceDeliverable { Item = "Creative Direction & Moodboard", Order = 2 },
                            new ServiceDeliverable { Item = "Model & Prop Styling", Order = 3 },
                            new ServiceDeliverable { Item = "Retouching & Compositing", Order = 4 },
                            new ServiceDeliverable { Item = "Licensing for Commercial Use", Order = 5 }
                        }
                    }
                },
                ProcessSteps = new List<ServiceProcess>
                {
                    new ServiceProcess { StepNumber = 1, Title = "Creative Brief", Description = "Share your brand vision, product line, and campaign goals.", Icon = "palette", Order = 1 },
                    new ServiceProcess { StepNumber = 2, Title = "Moodboard", Description = "We create a visual direction for your approval.", Icon = "dashboard", Order = 2 },
                    new ServiceProcess { StepNumber = 3, Title = "Shoot Day", Description = "Products are photographed under controlled studio lighting.", Icon = "camera", Order = 3 },
                    new ServiceProcess { StepNumber = 4, Title = "Post-Production", Description = "Retouching, colour grading, and exports for every platform.", Icon = "tune", Order = 4 }
                },
                FAQs = new List<ServiceFAQ>
                {
                    new ServiceFAQ { Question = "Do you provide styling and props?", Answer = "Yes, we have a curated prop library and can source additional materials specific to your brand aesthetic.", Order = 1 },
                    new ServiceFAQ { Question = "Can you match our existing brand colours?", Answer = "Absolutely. We calibrate our monitors and colour-check every export to ensure brand consistency.", Order = 2 },
                    new ServiceFAQ { Question = "How many photos per product?", Answer = "Typically 3–5 angles per product, but this is flexible based on your package and needs.", Order = 3 }
                }
            },

            // ── 4. Portrait Sessions ──
            new Service
            {
                Slug = "portrait",
                Title = "Portrait Sessions",
                Tagline = "Your story, your light, your moment",
                CoverImage = $"{R2_URL}/images/coverImages/cover3.webp",
                Icon = "person",
                ShortDescription = "Expressive, editorial-style portraits for individuals, couples, families, and creative professionals looking to stand out.",
                DetailedDescription = "A great portrait goes beyond a pose — it reveals personality. Whether you need powerful headshots for your LinkedIn, an artistic editorial for your portfolio, or a relaxed family session in golden hour light, we create images that feel authentic and elevated. Each session includes professional direction so you feel confident in front of the camera, along with premium retouching that enhances without over-processing.",
                StartingPrice = "$500",
                PriceNote = "Starting from",
                Features = new List<string>
                {
                    "Indoor Studio & Outdoor Locations",
                    "Professional Posing Direction",
                    "Wardrobe Consultation",
                    "Skin Retouching (Natural Look)",
                    "Multiple Outfit Changes",
                    "Same-Week Digital Delivery"
                },
                GalleryImages = new List<string>
                {
                    $"{R2_URL}/images/work/work3.webp",
                    $"{R2_URL}/images/work/work5.webp",
                    $"{R2_URL}/images/work/work9.webp",
                    $"{R2_URL}/images/work/work12.webp"
                },
                Tags = new List<string> { "portrait", "headshot", "family", "couple", "editorial", "personal-branding" },
                Category = "Portrait",
                MinDuration = "45 Minutes",
                TravelAvailable = true,
                IndoorOutdoor = "Both",
                Order = 4,
                IsFeatured = true,
                Packages = new List<ServicePackage>
                {
                    new ServicePackage
                    {
                        Name = "Mini Session", Price = "$500", Duration = "45 Minutes",
                        Description = "Quick and impactful — perfect for headshots and social profiles.",
                        Order = 1,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "1 Location / Backdrop", Order = 1 },
                            new ServiceDeliverable { Item = "1 Outfit", Order = 2 },
                            new ServiceDeliverable { Item = "15 Edited Photos", Order = 3 },
                            new ServiceDeliverable { Item = "Digital Downloads", Order = 4 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Classic Session", Price = "$900", Duration = "90 Minutes",
                        Description = "Our signature portrait experience with wardrobe changes.",
                        IsPopular = true, Order = 2,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "2 Locations / Backdrops", Order = 1 },
                            new ServiceDeliverable { Item = "2–3 Outfits", Order = 2 },
                            new ServiceDeliverable { Item = "35 Edited Photos", Order = 3 },
                            new ServiceDeliverable { Item = "Online Gallery", Order = 4 },
                            new ServiceDeliverable { Item = "Print Release", Order = 5 }
                        }
                    },
                    new ServicePackage
                    {
                        Name = "Editorial", Price = "$1,500", Duration = "3 Hours",
                        Description = "A full creative collaboration for magazine-worthy images.",
                        Order = 3,
                        Deliverables = new List<ServiceDeliverable>
                        {
                            new ServiceDeliverable { Item = "Multiple Locations", Order = 1 },
                            new ServiceDeliverable { Item = "Unlimited Wardrobe Changes", Order = 2 },
                            new ServiceDeliverable { Item = "60+ Edited Photos", Order = 3 },
                            new ServiceDeliverable { Item = "Styling Consultation", Order = 4 },
                            new ServiceDeliverable { Item = "Hair & Makeup Coordination", Order = 5 },
                            new ServiceDeliverable { Item = "Fine-Art Retouching", Order = 6 }
                        }
                    }
                },
                ProcessSteps = new List<ServiceProcess>
                {
                    new ServiceProcess { StepNumber = 1, Title = "Consultation", Description = "We discuss your goals, preferred style, and wardrobe.", Icon = "chat", Order = 1 },
                    new ServiceProcess { StepNumber = 2, Title = "Location Scouting", Description = "Choose from our recommended spots or pick your own meaningful location.", Icon = "explore", Order = 2 },
                    new ServiceProcess { StepNumber = 3, Title = "The Session", Description = "Relaxed, guided shooting with plenty of creative freedom.", Icon = "camera", Order = 3 },
                    new ServiceProcess { StepNumber = 4, Title = "Gallery Reveal", Description = "Your curated gallery, delivered within one week.", Icon = "auto_awesome", Order = 4 }
                },
                Testimonials = new List<ServiceTestimonial>
                {
                    new ServiceTestimonial { ClientName = "Neha Sharma", Event = "Brand Photoshoot", Quote = "I've never felt so comfortable in front of a camera. The final photos are absolutely stunning — I use them everywhere now.", Rating = 5, Order = 1 }
                },
                FAQs = new List<ServiceFAQ>
                {
                    new ServiceFAQ { Question = "I'm not photogenic — can you still make it work?", Answer = "Everyone says that! Professional direction and the right lighting make all the difference. We'll guide you every step of the way.", Order = 1 },
                    new ServiceFAQ { Question = "Can I bring my pet?", Answer = "Absolutely! Pets are welcome and make for some of the best candids.", Order = 2 },
                    new ServiceFAQ { Question = "Do you offer prints?", Answer = "Yes, we offer gallery-quality prints, canvases, and framed options through our print lab partner.", Order = 3 }
                }
            }
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} services successfully.", services.Count);
    }

    // ────────────────────────────────────────────────────────
    //  GALLERIES (from lib/portfolio.ts)
    // ────────────────────────────────────────────────────────

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
                Description = "A magical winter wedding set against the regal backdrop of Udaipur's lakeside palaces.",
                IsFeatured = true,
                Order = 1,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature0.webp", Width = 1200, Height = 1800, Alt = "Bride portrait", AspectRatio = 1200.0/1800.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work0.webp", Width = 1800, Height = 1200, Alt = "Wedding ceremony", AspectRatio = 1800.0/1200.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work4.webp", Width = 1600, Height = 1200, Alt = "Reception decor", AspectRatio = 1600.0/1200.0, Order = 3 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work11.webp", Width = 1200, Height = 1600, Alt = "Couple portrait", AspectRatio = 1200.0/1600.0, Order = 4 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg0.webp", Width = 1920, Height = 1080, Alt = "Venue wide shot", AspectRatio = 1920.0/1080.0, Order = 5 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg1.webp", Width = 1080, Height = 1920, Alt = "Detail shot", AspectRatio = 1080.0/1920.0, Order = 6 },
                    new MediaItem { Type = MediaType.Video, Url = $"{R2_URL}/videos/portrait-0/portrait0.m3u8", HlsUrl = $"{R2_URL}/videos/portrait-0/portrait0.m3u8", PosterUrl = $"{R2_URL}/images/thumbnail/t-portrait-0.webp", Width = 1080, Height = 1920, Duration = "1:42", Alt = "Wedding highlight reel", AspectRatio = 1080.0/1920.0, Order = 7 }
                }
            },
            new ProjectGallery
            {
                Slug = "sapan-sajnee",
                ClientName = "Sapan & Sajnee",
                Category = "Pre-Wedding",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature1.webp",
                ShootDate = new DateTime(2024, 11, 20, 0, 0, 0, DateTimeKind.Utc),
                Location = "Goa, India",
                Description = "Sun-soaked pre-wedding sessions along the golden shores of Goa.",
                IsFeatured = true,
                Order = 2,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature1.webp", Width = 1800, Height = 1200, Alt = "Couple walking on beach", AspectRatio = 1800.0/1200.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg2.webp", Width = 1920, Height = 1080, Alt = "Golden hour portrait", AspectRatio = 1920.0/1080.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg3.webp", Width = 1200, Height = 1800, Alt = "Sunset silhouette", AspectRatio = 1200.0/1800.0, Order = 3 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work5.webp", Width = 1600, Height = 1200, Alt = "Candid moment", AspectRatio = 1600.0/1200.0, Order = 4 },
                    new MediaItem { Type = MediaType.Video, Url = $"{R2_URL}/videos/landscape-0/landscape0.m3u8", HlsUrl = $"{R2_URL}/videos/landscape-0/landscape0.m3u8", PosterUrl = $"{R2_URL}/images/thumbnail/t-landscape-0.webp", Width = 1920, Height = 1080, Duration = "2:18", Alt = "Pre-wedding film", AspectRatio = 1920.0/1080.0, Order = 5 }
                }
            },
            new ProjectGallery
            {
                Slug = "aditya-gadhvi-live",
                ClientName = "Aditya Gadhvi Live",
                Category = "Event",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature2.webp",
                ShootDate = new DateTime(2025, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                Location = "Ahmedabad, India",
                Description = "Capturing the electric atmosphere at a sold-out Aditya Gadhvi concert.",
                IsFeatured = true,
                Order = 3,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature2.webp", Width = 1800, Height = 1200, Alt = "Stage performance", AspectRatio = 1800.0/1200.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work1.webp", Width = 1920, Height = 1080, Alt = "Audience wide shot", AspectRatio = 1920.0/1080.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work6.webp", Width = 1200, Height = 1800, Alt = "Backstage moment", AspectRatio = 1200.0/1800.0, Order = 3 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work7.webp", Width = 1800, Height = 1200, Alt = "Crowd energy", AspectRatio = 1800.0/1200.0, Order = 4 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work8.webp", Width = 1600, Height = 1200, Alt = "Lighting setup", AspectRatio = 1600.0/1200.0, Order = 5 }
                }
            },
            new ProjectGallery
            {
                Slug = "vidhi-kashyap",
                ClientName = "Vidhi & Kashyap",
                Category = "Baby Shower",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature3.webp",
                ShootDate = new DateTime(2025, 2, 14, 0, 0, 0, DateTimeKind.Utc),
                Location = "Surat, India",
                Description = "An intimate, joyful baby shower celebration dripping with love and laughter.",
                IsFeatured = false,
                Order = 4,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature3.webp", Width = 1800, Height = 1200, Alt = "Celebration moment", AspectRatio = 1800.0/1200.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work13.webp", Width = 1200, Height = 1800, Alt = "Decor details", AspectRatio = 1200.0/1800.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg4.webp", Width = 1920, Height = 1080, Alt = "Family portrait", AspectRatio = 1920.0/1080.0, Order = 3 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/bg/bg5.webp", Width = 1080, Height = 1920, Alt = "Candid laughter", AspectRatio = 1080.0/1920.0, Order = 4 }
                }
            },
            new ProjectGallery
            {
                Slug = "mv-collection",
                ClientName = "MV Collection",
                Category = "Product",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature4.webp",
                ShootDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                Location = "Studio, Ahmedabad",
                Description = "Luxury product photography for the MV lifestyle brand.",
                IsFeatured = false,
                Order = 5,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature4.webp", Width = 1200, Height = 1200, Alt = "Product hero shot", AspectRatio = 1.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work2.webp", Width = 1800, Height = 1200, Alt = "Product lifestyle", AspectRatio = 1800.0/1200.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work9.webp", Width = 1600, Height = 1200, Alt = "Detail macro", AspectRatio = 1600.0/1200.0, Order = 3 }
                }
            },
            new ProjectGallery
            {
                Slug = "vidhi-rushi",
                ClientName = "Vidhi & Rushi",
                Category = "Editorial",
                CoverPhotoUrl = $"{R2_URL}/images/feature/feature5.webp",
                ShootDate = new DateTime(2024, 10, 5, 0, 0, 0, DateTimeKind.Utc),
                Location = "Jaipur, India",
                Description = "A cinematic editorial couple portrait session in the pink city.",
                IsFeatured = true,
                Order = 6,
                Media = new List<MediaItem>
                {
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/feature/feature5.webp", Width = 1200, Height = 1800, Alt = "Editorial portrait", AspectRatio = 1200.0/1800.0, Order = 1 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work3.webp", Width = 1800, Height = 1200, Alt = "Architecture blend", AspectRatio = 1800.0/1200.0, Order = 2 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work10.webp", Width = 1200, Height = 1800, Alt = "Fashion editorial", AspectRatio = 1200.0/1800.0, Order = 3 },
                    new MediaItem { Type = MediaType.Photo, Url = $"{R2_URL}/images/work/work12.webp", Width = 1800, Height = 1200, Alt = "Candid editorial", AspectRatio = 1800.0/1200.0, Order = 4 },
                    new MediaItem { Type = MediaType.Video, Url = $"{R2_URL}/videos/portrait-1/portrait1.m3u8", HlsUrl = $"{R2_URL}/videos/portrait-1/portrait1.m3u8", PosterUrl = $"{R2_URL}/images/thumbnail/t-portrait-1.webp", Width = 1080, Height = 1920, Duration = "1:55", Alt = "Editorial reel", AspectRatio = 1080.0/1920.0, Order = 5 }
                }
            }
        };

        context.ProjectGalleries.AddRange(galleries);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} galleries successfully.", galleries.Count);
    }

    // ────────────────────────────────────────────────────────
    //  SITE BIO (from lib/bio.ts)
    // ────────────────────────────────────────────────────────

    private static async Task SeedSiteBioAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.SiteBios.AnyAsync())
        {
            logger.LogInformation("SiteBios table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding SiteBio...");

        var bio = new SiteBio
        {
            ArtistName = "Abhi Kansara",
            Tagline = "I believe in the beauty of unscripted moments.",
            Intro = "My approach to wedding photography is deeply rooted in editorial elegance and raw, emotional authenticity. I don't just want to take pictures of what your wedding looked like; I want to capture exactly how it felt.",
            History = "Based in India and traveling worldwide, I've spent the last decade documenting love stories for couples who value art, emotion, and cinematic perfection. When I'm not behind the lens, you'll find me studying classic cinema or chasing the perfect golden hour.",
            Philosophy = "To photograph truthfully and effectively is to see beneath the surfaces and record the qualities of nature and humanity which live or are latent in all things.",
            PortraitImage = $"{R2_URL}/images/Abhi.webp"
        };

        context.SiteBios.Add(bio);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded SiteBio successfully.");
    }

    // ────────────────────────────────────────────────────────
    //  PAGE CONFIGS (from lib/services.ts & lib/portfolio.ts)
    // ────────────────────────────────────────────────────────

    private static async Task SeedPageConfigsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.PageConfigs.AnyAsync())
        {
            logger.LogInformation("PageConfigs table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding PageConfigs...");

        var configs = new List<PageConfig>
        {
            new PageConfig
            {
                PageKey = "services",
                HeroTagline = "Experiences",
                HeroTitle = "Crafted with Intention",
                HeroSubtitle = "Every frame tells a story. Explore our curated photography experiences designed to capture the moments that matter most.",
                CtaText = "Book a Consultation",
                CtaLink = "/contact",
                SectionTitle1 = "How We Work",
                SectionSubtitle1 = "A seamless journey from first conversation to final delivery.",
                SectionTitle2 = "Questions & Answers",
                SectionSubtitle2 = "Everything you need to know before we begin."
            },
            new PageConfig
            {
                PageKey = "portfolio",
                HeroTagline = "Portfolio",
                HeroTitle = "Our Work",
                HeroSubtitle = "A curated collection of moments, emotions, and stories — captured through the lens of passion and artistry."
            }
        };

        context.PageConfigs.AddRange(configs);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} page configs successfully.", configs.Count);
    }

    // ────────────────────────────────────────────────────────
    //  CAROUSEL ITEMS
    // ────────────────────────────────────────────────────────

    private static async Task SeedCarouselItemsAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.CarouselItems.AnyAsync())
        {
            logger.LogInformation("CarouselItems table already seeded. Skipping.");
            return;
        }

        logger.LogInformation("Seeding CarouselItems...");

        var items = new List<CarouselItem>
        {
            new CarouselItem { SortOrder = 1, Title = "Wedding", ImageUrl = $"{R2_URL}/images/work/work0.webp" },
            new CarouselItem { SortOrder = 2, Title = "Event", ImageUrl = $"{R2_URL}/images/work/work1.webp" },
            new CarouselItem { SortOrder = 3, Title = "Product", ImageUrl = $"{R2_URL}/images/work/work2.webp" },
            new CarouselItem { SortOrder = 4, Title = "Photography", ImageUrl = $"{R2_URL}/images/work/work3.webp" },
            new CarouselItem { SortOrder = 5, Title = "Pre-Wedding", ImageUrl = $"{R2_URL}/images/work/work4.webp" },
            new CarouselItem { SortOrder = 6, Title = "Photography", ImageUrl = $"{R2_URL}/images/work/work5.webp" },
            new CarouselItem { SortOrder = 7, Title = "Event", ImageUrl = $"{R2_URL}/images/work/work6.webp" },
            new CarouselItem { SortOrder = 8, Title = "Event", ImageUrl = $"{R2_URL}/images/work/work7.webp" },
            new CarouselItem { SortOrder = 9, Title = "Event", ImageUrl = $"{R2_URL}/images/work/work8.webp" },
            new CarouselItem { SortOrder = 10, Title = "Photography", ImageUrl = $"{R2_URL}/images/work/work9.webp" },
            new CarouselItem { SortOrder = 11, Title = "Editorial", ImageUrl = $"{R2_URL}/images/work/work10.webp" },
            new CarouselItem { SortOrder = 12, Title = "Pre-Wedding", ImageUrl = $"{R2_URL}/images/work/work11.webp" },
            new CarouselItem { SortOrder = 13, Title = "Photography", ImageUrl = $"{R2_URL}/images/work/work12.webp" },
            new CarouselItem { SortOrder = 14, Title = "Baby Shower", ImageUrl = $"{R2_URL}/images/work/work13.webp" }
        };

        context.CarouselItems.AddRange(items);
        await context.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} carousel items successfully.", items.Count);
    }
}
