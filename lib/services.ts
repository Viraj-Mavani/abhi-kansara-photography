const R2_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

// ─────────────────────────────────────────────────────────
//  Type Definitions — Services Data Layer
// ─────────────────────────────────────────────────────────

/** A single deliverable item within a package */
export interface ServiceDeliverable {
  item: string;
  detail?: string; // e.g., "Edited in Lightroom & Photoshop"
}

/** A pricing package/tier for a service */
export interface ServicePackage {
  name: string; // e.g., "Essential", "Premium", "Luxury"
  price?: string; // e.g., "$2,500" — optional until client confirms
  priceNote?: string; // e.g., "Starting from", "Per hour"
  duration?: string; // e.g., "4 Hours", "Full Day"
  description?: string; // Brief blurb about the package
  deliverables: ServiceDeliverable[];
  isPopular?: boolean; // Highlight badge
}

/** FAQ entry */
export interface ServiceFAQ {
  question: string;
  answer: string;
}

/** Step in the booking/working process */
export interface ServiceProcess {
  step: number;
  title: string;
  description: string;
  icon?: string; // Material Symbols icon name
}

/** A testimonial/review for a specific service */
export interface ServiceTestimonial {
  clientName: string;
  event?: string; // e.g., "Wedding — Dec 2024"
  quote: string;
  rating?: number; // 1–5
  avatar?: string;
}

/** An add-on or extra that can accompany a service */
export interface ServiceAddOn {
  name: string;
  price?: string;
  description?: string;
}

/** Full service definition — every field the page can render */
export interface DetailedService {
  // ── Core ──
  id: string;
  title: string;
  tagline: string;
  coverImage: string;
  icon?: string; // Material Symbols icon name

  // ── Descriptions ──
  shortDescription: string;
  detailedDescription: string;

  // ── Pricing ──
  startingPrice?: string;
  priceNote?: string; // "Starting from", "Enquire for custom"
  packages: ServicePackage[];
  addOns?: ServiceAddOn[];

  // ── Features & Highlights ──
  features: string[];
  highlights?: string[]; // Quick visual bullet points

  // ── Process / Timeline ──
  process: ServiceProcess[];

  // ── Social Proof ──
  testimonials?: ServiceTestimonial[];

  // ── FAQ ──
  faqs: ServiceFAQ[];

  // ── Gallery ──
  galleryImages: string[];

  // ── Metadata ──
  category?: string; // e.g., "Wedding", "Corporate"
  tags?: string[]; // For filtering
  minDuration?: string;
  maxCapacity?: string;
  travelAvailable?: boolean;
  indoorOutdoor?: "Indoor" | "Outdoor" | "Both";

  // ── Display Order ──
  order?: number;
  isFeatured?: boolean;
}

/** Page-level configuration (hero, section titles, CTA, etc.) */
export interface ServicesPageConfig {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
  processTitle?: string;
  processSubtitle?: string;
  faqTitle?: string;
  faqSubtitle?: string;
}

// ─────────────────────────────────────────────────────────
//  Page Configuration
// ─────────────────────────────────────────────────────────

export const servicesPageConfig: ServicesPageConfig = {
  heroTagline: "Experiences",
  heroTitle: "Crafted with Intention",
  heroSubtitle:
    "Every frame tells a story. Explore our curated photography experiences designed to capture the moments that matter most.",
  ctaText: "Book a Consultation",
  ctaLink: "/contact",
  processTitle: "How We Work",
  processSubtitle: "A seamless journey from first conversation to final delivery.",
  faqTitle: "Questions & Answers",
  faqSubtitle: "Everything you need to know before we begin.",
};

// ─────────────────────────────────────────────────────────
//  Dummy Services (4 fully populated for testing)
// ─────────────────────────────────────────────────────────

export const detailedServices: DetailedService[] = [
	{
		id: "wedding",
		title: "Wedding Photography",
		tagline: "Your love story, told through light",
		coverImage: `${R2_URL}/images/coverImages/cover0.webp`,
		icon: "favorite",
		shortDescription:
			"Timeless, cinematic wedding coverage that captures every stolen glance, joyful tear, and spontaneous dance move — so you can relive the magic for generations.",
		detailedDescription:
			"We approach every wedding as a once-in-a-lifetime narrative. From the quiet intimacy of getting ready to the electric energy of the reception, our dual-photographer setup ensures no moment goes unnoticed. We blend photojournalistic candids with carefully composed editorial shots, delivering a gallery that feels like flipping through the pages of a luxury magazine. Our post-production process includes colour-grading tailored to the venue's light, skin-tone perfection, and a cinematic consistency across every frame.",
		startingPrice: "$3,500",
		priceNote: "Starting from",
		features: [
			"Dual Photographer Coverage",
			"Engagement Session Included",
			"Custom Online Gallery",
			"Cinematic Colour Grading",
			"Drone Aerial Shots",
			"Same-Day Sneak Peeks",
			"High-Resolution Digital Files",
			"Print Release Included",
		],
		highlights: [
			"500+ Edited Photos",
			"8–12 Hour Coverage",
			"48hr Sneak Peek Delivery",
			"4–6 Week Full Delivery",
		],
		packages: [
			{
				name: "Essential",
				price: "$3,500",
				priceNote: "Starting from",
				duration: "6 Hours",
				description: "Perfect for intimate ceremonies and elopements.",
				deliverables: [
					{ item: "One Lead Photographer" },
					{ item: "300+ Edited Photos" },
					{ item: "Online Gallery", detail: "Password-protected" },
					{ item: "High-Resolution Downloads" },
					{ item: "Print Release" },
				],
			},
			{
				name: "Signature",
				price: "$5,500",
				priceNote: "Most Popular",
				duration: "10 Hours",
				description:
					"Our most-loved package for full-day celebrations.",
				deliverables: [
					{ item: "Two Photographers" },
					{ item: "500+ Edited Photos" },
					{ item: "Engagement Session" },
					{ item: "Same-Day Sneak Peeks" },
					{ item: "Drone Coverage" },
					{ item: "Custom Online Gallery" },
					{ item: "Print Release" },
				],
				isPopular: true,
			},
			{
				name: "Luxury",
				price: "$8,000",
				priceNote: "All-Inclusive",
				duration: "Full Day + After-Party",
				description:
					"The ultimate experience — every detail, every moment.",
				deliverables: [
					{ item: "Two Photographers + Assistant" },
					{ item: "700+ Edited Photos" },
					{ item: "Engagement + Pre-Wedding Session" },
					{ item: "Bridal Portrait Session" },
					{ item: "Premium Leather Album", detail: "40 pages" },
					{ item: "Canvas Wall Art", detail: "24×36 inch" },
					{ item: "Same-Day Slideshow" },
					{ item: "Drone + Cinematic Coverage" },
				],
			},
		],
		addOns: [
			{
				name: "Extra Hour",
				price: "$400",
				description: "Extend your coverage",
			},
			{
				name: "Second Shooter",
				price: "$600",
				description: "Additional angle coverage",
			},
			{
				name: "Photo Album",
				price: "$800",
				description: "Hand-crafted premium album",
			},
			{
				name: "Rush Delivery",
				price: "$500",
				description: "Gallery within 2 weeks",
			},
		],
		process: [
			{
				step: 1,
				title: "Discovery Call",
				description:
					"We get to know your vision, venue, and timeline over a friendly call.",
				icon: "call",
			},
			{
				step: 2,
				title: "Proposal & Booking",
				description:
					"Receive a tailored proposal. Secure your date with a retainer.",
				icon: "description",
			},
			{
				step: 3,
				title: "Pre-Wedding Planning",
				description:
					"Location scouts, timeline reviews, and a complimentary engagement shoot.",
				icon: "calendar_month",
			},
			{
				step: 4,
				title: "The Big Day",
				description:
					"We arrive early, blend in, and capture everything authentically.",
				icon: "camera",
			},
			{
				step: 5,
				title: "Curation & Delivery",
				description:
					"Hand-edited gallery delivered via your private online portal.",
				icon: "photo_library",
			},
		],
		testimonials: [
			{
				clientName: "Priya & Arjun",
				event: "Wedding — January 2025",
				quote: "Abhi didn't just photograph our wedding — he captured the feeling of it. Every image transports us right back to that day.",
				rating: 5,
			},
			{
				clientName: "Meera & Raj",
				event: "Wedding — March 2024",
				quote: "The team was invisible yet everywhere. We were blown away by the final gallery.",
				rating: 5,
			},
		],
		faqs: [
			{
				question: "How far in advance should we book?",
				answer: "We recommend booking 6–12 months in advance, especially for peak wedding season. However, we occasionally have last-minute availability.",
			},
			{
				question: "Do you travel for destination weddings?",
				answer: "Absolutely! We love destination weddings. Travel fees vary by location — reach out for a custom quote.",
			},
			{
				question: "When will we receive our photos?",
				answer: "You'll receive same-day sneak peeks within 48 hours. The full gallery is typically delivered within 4–6 weeks.",
			},
			{
				question: "Can we request specific shots?",
				answer: "Of course. We'll work with you on a shot list beforehand while still leaving room for spontaneous magic.",
			},
		],
		galleryImages: [
			`${R2_URL}/images/work/work0.webp`,
			`${R2_URL}/images/work/work4.webp`,
			`${R2_URL}/images/work/work11.webp`,
			`${R2_URL}/images/feature/feature0.webp`,
			`${R2_URL}/images/feature/feature1.webp`,
			`${R2_URL}/images/feature/feature3.webp`,
		],
		category: "Wedding",
		tags: ["wedding", "bridal", "ceremony", "reception", "engagement"],
		minDuration: "6 Hours",
		travelAvailable: true,
		indoorOutdoor: "Both",
		order: 1,
		isFeatured: true,
	},

	{
		id: "events",
		title: "Event Coverage",
		tagline: "The energy, the crowd, the spectacle",
		coverImage: `${R2_URL}/images/coverImages/cover1.webp`,
		icon: "celebration",
		shortDescription:
			"From corporate galas to live concerts, we document the pulse and personality of every event with editorial precision.",
		detailedDescription:
			"Events move fast — and so do we. Our event photography is built around anticipation, positioning, and storytelling. Whether it's a 50-person corporate dinner or a 5,000-seat concert, we deliver imagery that captures the atmosphere, the key moments, and the human connections that make each event unique. Our fast turnaround means your marketing team or event organiser gets publishable content within days, not months.",
		startingPrice: "$1,200",
		priceNote: "Starting from",
		features: [
			"Fast Turnaround (48–72hrs)",
			"Multi-Angle Coverage",
			"On-Site Selection Preview",
			"Social-Media Ready Crops",
			"High-Resolution Delivery",
			"Red Carpet & Stage Coverage",
		],
		packages: [
			{
				name: "Half Day",
				price: "$1,200",
				duration: "4 Hours",
				description:
					"Ideal for corporate networking events and small gatherings.",
				deliverables: [
					{ item: "One Photographer" },
					{ item: "150+ Edited Photos" },
					{ item: "48-Hour Delivery" },
					{ item: "Social Media Crops" },
				],
			},
			{
				name: "Full Day",
				price: "$2,200",
				duration: "8 Hours",
				description:
					"Comprehensive coverage for conferences, galas, or festivals.",
				deliverables: [
					{ item: "Two Photographers" },
					{ item: "350+ Edited Photos" },
					{
						item: "Same-Day Highlights",
						detail: "5 edited shots within 3 hours",
					},
					{ item: "Custom Online Gallery" },
					{ item: "Print Release" },
				],
				isPopular: true,
			},
			{
				name: "Multi-Day",
				price: "Custom",
				priceNote: "Get a Quote",
				duration: "2+ Days",
				description:
					"For festivals, multi-day conferences, or concert series.",
				deliverables: [
					{ item: "Dedicated Photography Team" },
					{ item: "Daily Highlight Delivery" },
					{ item: "On-Site Editing Station" },
					{ item: "Social-Media Content Strategy" },
					{ item: "Event Recap Video Stills" },
				],
			},
		],
		process: [
			{
				step: 1,
				title: "Briefing",
				description:
					"Understand the event agenda, branding, and key stakeholders.",
				icon: "groups",
			},
			{
				step: 2,
				title: "Site Recce",
				description:
					"Visit the venue to plan lighting, angles, and logistics.",
				icon: "location_on",
			},
			{
				step: 3,
				title: "Capture",
				description:
					"On the day — discreet, professional, and thorough.",
				icon: "camera",
			},
			{
				step: 4,
				title: "Fast Delivery",
				description: "Curated gallery delivered within 48–72 hours.",
				icon: "bolt",
			},
		],
		faqs: [
			{
				question: "Can you provide same-day photos for social media?",
				answer: "Yes! We can deliver 5–10 edited highlights within a few hours of the event for immediate posting.",
			},
			{
				question: "Do you cover corporate branding requirements?",
				answer: "Absolutely. We follow brand guidelines for composition, ensuring logos and backdrops are featured appropriately.",
			},
			{
				question: "What about low-light venues?",
				answer: "We use professional-grade low-light equipment and off-camera lighting to produce stunning results in any environment.",
			},
		],
		galleryImages: [
			`${R2_URL}/images/work/work1.webp`,
			`${R2_URL}/images/work/work6.webp`,
			`${R2_URL}/images/work/work7.webp`,
			`${R2_URL}/images/work/work8.webp`,
			`${R2_URL}/images/feature/feature2.webp`,
		],
		category: "Events",
		tags: ["corporate", "concert", "gala", "conference", "festival"],
		minDuration: "4 Hours",
		travelAvailable: true,
		indoorOutdoor: "Both",
		order: 2,
		isFeatured: true,
	},

	{
		id: "product",
		title: "Product Photography",
		tagline: "Elevate your brand, frame by frame",
		coverImage: `${R2_URL}/images/coverImages/cover2.webp`,
		icon: "diamond",
		shortDescription:
			"High-end product and commercial photography that transforms everyday objects into objects of desire.",
		detailedDescription:
			"Great products deserve imagery that sells. We specialise in studio and lifestyle product photography that elevates brands across e-commerce, social media, and print. From moody flat-lays to crisp packshots on white, every shoot is art-directed in collaboration with your creative team. We handle everything — styling, props, lighting rigs, and colour-accurate post-production — so your products look irresistible on every screen.",
		startingPrice: "$800",
		priceNote: "Per session",
		features: [
			"Studio & On-Location",
			"E-Commerce White Background",
			"Lifestyle Contextual Shots",
			"Flat-Lay & Hero Compositions",
			"Colour-Accurate Editing",
			"Multi-Platform Crops (Web, Social, Print)",
		],
		packages: [
			{
				name: "Starter",
				price: "$800",
				duration: "Half Day",
				description: "Up to 10 products with clean studio shots.",
				deliverables: [
					{ item: "10 Products" },
					{ item: "3 Angles Per Product" },
					{ item: "White Background Packshots" },
					{ item: "High-Resolution Files" },
					{ item: "Web-Optimised Exports" },
				],
			},
			{
				name: "Brand Builder",
				price: "$1,800",
				duration: "Full Day",
				description:
					"Up to 25 products with lifestyle and studio shots.",
				deliverables: [
					{ item: "25 Products" },
					{ item: "Studio + Lifestyle Shots" },
					{ item: "Flat-Lay Compositions" },
					{ item: "Social Media Crops" },
					{ item: "Art Direction Included" },
				],
				isPopular: true,
			},
			{
				name: "Campaign",
				price: "Custom",
				priceNote: "Let's Talk",
				duration: "Multi-Day",
				description:
					"Full creative campaign — lookbooks, hero images, and more.",
				deliverables: [
					{ item: "Unlimited Products" },
					{ item: "Creative Direction & Moodboard" },
					{ item: "Model & Prop Styling" },
					{ item: "Retouching & Compositing" },
					{ item: "Licensing for Commercial Use" },
				],
			},
		],
		process: [
			{
				step: 1,
				title: "Creative Brief",
				description:
					"Share your brand vision, product line, and campaign goals.",
				icon: "palette",
			},
			{
				step: 2,
				title: "Moodboard",
				description: "We create a visual direction for your approval.",
				icon: "dashboard",
			},
			{
				step: 3,
				title: "Shoot Day",
				description:
					"Products are photographed under controlled studio lighting.",
				icon: "camera",
			},
			{
				step: 4,
				title: "Post-Production",
				description:
					"Retouching, colour grading, and exports for every platform.",
				icon: "tune",
			},
		],
		faqs: [
			{
				question: "Do you provide styling and props?",
				answer: "Yes, we have a curated prop library and can source additional materials specific to your brand aesthetic.",
			},
			{
				question: "Can you match our existing brand colours?",
				answer: "Absolutely. We calibrate our monitors and colour-check every export to ensure brand consistency.",
			},
			{
				question: "How many photos per product?",
				answer: "Typically 3–5 angles per product, but this is flexible based on your package and needs.",
			},
		],
		galleryImages: [
			`${R2_URL}/images/work/work2.webp`,
			`${R2_URL}/images/feature/feature4.webp`,
		],
		category: "Commercial",
		tags: ["product", "ecommerce", "brand", "commercial", "studio"],
		minDuration: "Half Day",
		travelAvailable: false,
		indoorOutdoor: "Indoor",
		order: 3,
		isFeatured: false,
	},

	{
		id: "portrait",
		title: "Portrait Sessions",
		tagline: "Your story, your light, your moment",
		coverImage: `${R2_URL}/images/coverImages/cover3.webp`,
		icon: "person",
		shortDescription:
			"Expressive, editorial-style portraits for individuals, couples, families, and creative professionals looking to stand out.",
		detailedDescription:
			"A great portrait goes beyond a pose — it reveals personality. Whether you need powerful headshots for your LinkedIn, an artistic editorial for your portfolio, or a relaxed family session in golden hour light, we create images that feel authentic and elevated. Each session includes professional direction so you feel confident in front of the camera, along with premium retouching that enhances without over-processing.",
		startingPrice: "$500",
		priceNote: "Starting from",
		features: [
			"Indoor Studio & Outdoor Locations",
			"Professional Posing Direction",
			"Wardrobe Consultation",
			"Skin Retouching (Natural Look)",
			"Multiple Outfit Changes",
			"Same-Week Digital Delivery",
		],
		packages: [
			{
				name: "Mini Session",
				price: "$500",
				duration: "45 Minutes",
				description:
					"Quick and impactful — perfect for headshots and social profiles.",
				deliverables: [
					{ item: "1 Location / Backdrop" },
					{ item: "1 Outfit" },
					{ item: "15 Edited Photos" },
					{ item: "Digital Downloads" },
				],
			},
			{
				name: "Classic Session",
				price: "$900",
				duration: "90 Minutes",
				description:
					"Our signature portrait experience with wardrobe changes.",
				deliverables: [
					{ item: "2 Locations / Backdrops" },
					{ item: "2–3 Outfits" },
					{ item: "35 Edited Photos" },
					{ item: "Online Gallery" },
					{ item: "Print Release" },
				],
				isPopular: true,
			},
			{
				name: "Editorial",
				price: "$1,500",
				duration: "3 Hours",
				description:
					"A full creative collaboration for magazine-worthy images.",
				deliverables: [
					{ item: "Multiple Locations" },
					{ item: "Unlimited Wardrobe Changes" },
					{ item: "60+ Edited Photos" },
					{ item: "Styling Consultation" },
					{ item: "Hair & Makeup Coordination" },
					{ item: "Fine-Art Retouching" },
				],
			},
		],
		process: [
			{
				step: 1,
				title: "Consultation",
				description:
					"We discuss your goals, preferred style, and wardrobe.",
				icon: "chat",
			},
			{
				step: 2,
				title: "Location Scouting",
				description:
					"Choose from our recommended spots or pick your own meaningful location.",
				icon: "explore",
			},
			{
				step: 3,
				title: "The Session",
				description:
					"Relaxed, guided shooting with plenty of creative freedom.",
				icon: "camera",
			},
			{
				step: 4,
				title: "Gallery Reveal",
				description: "Your curated gallery, delivered within one week.",
				icon: "auto_awesome",
			},
		],
		testimonials: [
			{
				clientName: "Neha Sharma",
				event: "Brand Photoshoot",
				quote: "I've never felt so comfortable in front of a camera. The final photos are absolutely stunning — I use them everywhere now.",
				rating: 5,
			},
		],
		faqs: [
			{
				question: "I'm not photogenic — can you still make it work?",
				answer: "Everyone says that! Professional direction and the right lighting make all the difference. We'll guide you every step of the way.",
			},
			{
				question: "Can I bring my pet?",
				answer: "Absolutely! Pets are welcome and make for some of the best candids.",
			},
			{
				question: "Do you offer prints?",
				answer: "Yes, we offer gallery-quality prints, canvases, and framed options through our print lab partner.",
			},
		],
		galleryImages: [
			`${R2_URL}/images/work/work3.webp`,
			`${R2_URL}/images/work/work5.webp`,
			`${R2_URL}/images/work/work9.webp`,
			`${R2_URL}/images/work/work12.webp`,
		],
		category: "Portrait",
		tags: [
			"portrait",
			"headshot",
			"family",
			"couple",
			"editorial",
			"personal-branding",
		],
		minDuration: "45 Minutes",
		travelAvailable: true,
		indoorOutdoor: "Both",
		order: 4,
		isFeatured: true,
	},
];
