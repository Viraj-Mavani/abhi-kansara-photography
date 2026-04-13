const R2_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

// ─────────────────────────────────────────────────────────
//  Type Definitions — Portfolio / Gallery Data Layer
//  Designed to mirror a Headless CMS payload (Sanity, Strapi, Contentful)
// ─────────────────────────────────────────────────────────

/** Supported gallery categories — used for UI classification only */
export type GalleryCategory =
	| "Wedding"
	| "Pre-Wedding"
	| "Baby Shower"
	| "Event"
	| "Product"
	| "Editorial"
	| "Portrait";

/** A single media item within a gallery */
export interface MediaItem {
	id: string;
	type: "photo" | "video";
	url: string;
	width?: number; // Optional — grid will default to 3:2 if missing
	height?: number; // Optional — grid will default to 3:2 if missing
	alt?: string; // Accessibility alt text
	posterUrl?: string; // For video thumbnails
	hlsUrl?: string; // HLS stream URL for videos
	duration?: string; // e.g. "2:35"
}

/** Full gallery definition — maps 1:1 to a future CMS content type */
export interface Gallery {
	id: string;
	slug: string; // Flat URL slug: 'aaina-daideep'
	clientName: string;
	category: GalleryCategory;
	coverPhotoUrl: string;
	date?: string; // ISO date string
	location?: string;
	description?: string; // Short blurb
	media: MediaItem[]; // Photos first, then videos
	isFeatured?: boolean;
	order?: number;
}

/** Page-level configuration for the portfolio hub */
export interface PortfolioPageConfig {
	heroTagline: string;
	heroTitle: string;
	heroSubtitle: string;
}

// ─────────────────────────────────────────────────────────
//  Page Configuration
// ─────────────────────────────────────────────────────────

export const portfolioPageConfig: PortfolioPageConfig = {
	heroTagline: "Portfolio",
	heroTitle: "Our Work",
	heroSubtitle:
		"A curated collection of moments, emotions, and stories — captured through the lens of passion and artistry.",
};

// ─────────────────────────────────────────────────────────
//  Mock Gallery Data
//  (Swap with CMS fetch in the future)
// ─────────────────────────────────────────────────────────

export const galleries: Gallery[] = [
	{
		id: "g1",
		slug: "aditya-gadhvi-live",
		clientName: "Aditya Gadhvi",
		category: "Event",
		coverPhotoUrl: `${R2_URL}/images/feature/feature1.webp`,
		date: "2025-08-15",
		location: "Toronto, Canada",
		// description: "A magical winter wedding set against the regal backdrop of Udaipur's lakeside palaces.",
		isFeatured: true,
		order: 1,
		media: [
			{ id: "c1_1", type: "photo", url: `${R2_URL}/images/clients/c1/c1_1.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 1" },
			{ id: "c1_2", type: "photo", url: `${R2_URL}/images/clients/c1/c1_2.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 2" },
			{ id: "c1_3", type: "photo", url: `${R2_URL}/images/clients/c1/c1_3.webp`, width: 1920, height: 1280, alt: "Aditya Gadhvi 3" },
			{ id: "c1_4", type: "photo", url: `${R2_URL}/images/clients/c1/c1_4.webp`, width: 1920, height: 1280, alt: "Aditya Gadhvi 4" },
			{ id: "c1_5", type: "photo", url: `${R2_URL}/images/clients/c1/c1_5.webp`, width: 1920, height: 1280, alt: "Aditya Gadhvi 5" },
			{ id: "c1_6", type: "photo", url: `${R2_URL}/images/clients/c1/c1_6.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 6" },
			{ id: "c1_7", type: "photo", url: `${R2_URL}/images/clients/c1/c1_7.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 7" },
			{ id: "c1_8", type: "photo", url: `${R2_URL}/images/clients/c1/c1_8.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 8" },
			{ id: "c1_9", type: "photo", url: `${R2_URL}/images/clients/c1/c1_9.webp`, width: 1920, height: 1280, alt: "Aditya Gadhvi 9" },
			{ id: "c1_10", type: "photo", url: `${R2_URL}/images/clients/c1/c1_10.webp`, width: 1920, height: 1280, alt: "Aditya Gadhvi 10" },
			// { id: "g1-v1", type: "video", url: `${R2_URL}/videos/portrait-0/portrait0.m3u8`, hlsUrl: `${R2_URL}/videos/portrait-0/portrait0.m3u8`, posterUrl: `${R2_URL}/images/thumbnail/t-portrait-0.webp`, width: 1080, height: 1920, duration: "1:42", alt: "Wedding highlight reel" },
		],
	},
	{
		id: "g2",
		slug: "zeel-dhaval",
		clientName: "Zeel & Dhaval",
		category: "Pre-Wedding",
		coverPhotoUrl: `${R2_URL}/images/feature/feature2.webp`,
		date: "2025-11-20",
		location: "Kitchener, Canada",
		// description: "Sun-soaked pre-wedding sessions along the golden shores of Goa.",
		isFeatured: true,
		order: 2,
		media: [
			{ id: "c2_1", type: "photo", url: `${R2_URL}/images/clients/c2/c2_1.webp`, width: 1920, height: 1280, alt: "Sapan & Sajnee 1" },
			{ id: "c2_2", type: "photo", url: `${R2_URL}/images/clients/c2/c2_2.webp`, width: 1080, height: 1620, alt: "Sapan & Sajnee 2" },
			{ id: "c2_3", type: "photo", url: `${R2_URL}/images/clients/c2/c2_3.webp`, width: 1920, height: 1280, alt: "Sapan & Sajnee 3" },
			{ id: "c2_4", type: "photo", url: `${R2_URL}/images/clients/c2/c2_4.webp`, width: 1920, height: 1280, alt: "Sapan & Sajnee 4" },
			{ id: "c2_5", type: "photo", url: `${R2_URL}/images/clients/c2/c2_5.webp`, width: 1080, height: 1620, alt: "Sapan & Sajnee 5" },
			{ id: "c2_6", type: "photo", url: `${R2_URL}/images/clients/c2/c2_6.webp`, width: 1920, height: 1280, alt: "Sapan & Sajnee 6" },
			{ id: "c2_7", type: "photo", url: `${R2_URL}/images/clients/c2/c2_7.webp`, width: 1080, height: 1620, alt: "Sapan & Sajnee 7" },
			{ id: "c2_8", type: "photo", url: `${R2_URL}/images/clients/c2/c2_8.webp`, width: 1080, height: 1620, alt: "Sapan & Sajnee 8" },
			{ id: "c2_9", type: "photo", url: `${R2_URL}/images/clients/c2/c2_9.webp`, width: 1920, height: 1280, alt: "Sapan & Sajnee 9" },
			// { id: "g2-v1", type: "video", url: `${R2_URL}/videos/landscape-0/landscape0.m3u8`, hlsUrl: `${R2_URL}/videos/landscape-0/landscape0.m3u8`, posterUrl: `${R2_URL}/images/thumbnail/t-landscape-0.webp`, width: 1920, height: 1080, duration: "2:18", alt: "Pre-wedding film" },
		],
	},
	{
		id: "g3",
		slug: "dhruv",
		clientName: "Dhruv",
		category: "Portrait",
		coverPhotoUrl: `${R2_URL}/images/feature/feature3.webp`,
		date: "2026-01-10",
		location: "London, Canada",
		// description: "Capturing the electric atmosphere at a sold-out Aditya Gadhvi concert.",
		isFeatured: true,
		order: 3,
		media: [
			{ id: "c3_1", type: "photo", url: `${R2_URL}/images/clients/c3/c3_1.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 1" },
			{ id: "c3_2", type: "photo", url: `${R2_URL}/images/clients/c3/c3_2.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 2" },
			{ id: "c3_3", type: "photo", url: `${R2_URL}/images/clients/c3/c3_3.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 3" },
			{ id: "c3_4", type: "photo", url: `${R2_URL}/images/clients/c3/c3_4.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 4" },
			{ id: "c3_5", type: "photo", url: `${R2_URL}/images/clients/c3/c3_5.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 5" },
			{ id: "c3_6", type: "photo", url: `${R2_URL}/images/clients/c3/c3_6.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 6" },
			{ id: "c3_7", type: "photo", url: `${R2_URL}/images/clients/c3/c3_7.webp`, width: 1080, height: 1620, alt: "Aditya Gadhvi 7" },
		],
	},
	{
		id: "g4",
		slug: "jeel-khushang",
		clientName: "Jeel & Khushang",
		category: "Wedding",
		coverPhotoUrl: `${R2_URL}/images/feature/feature4.webp`,
		date: "2025-02-14",
		location: "Toronto, Canada",
		// description: "An intimate, joyful baby shower celebration dripping with love and laughter.",
		isFeatured: true,
		order: 4,
		media: [
			{ id: "c4_1", type: "photo", url: `${R2_URL}/images/clients/c4/c4_1.webp`, width: 1080, height: 1620, alt: "Vidhi & Kashyap 1" },
			{ id: "c4_2", type: "photo", url: `${R2_URL}/images/clients/c4/c4_2.webp`, width: 1080, height: 1620, alt: "Vidhi & Kashyap 2" },
			{ id: "c4_3", type: "photo", url: `${R2_URL}/images/clients/c4/c4_3.webp`, width: 1080, height: 1620, alt: "Vidhi & Kashyap 3" },
			{ id: "c4_4", type: "photo", url: `${R2_URL}/images/clients/c4/c4_4.webp`, width: 1080, height: 1620, alt: "Vidhi & Kashyap 4" },
		],
	},
	{
		id: "g5",
		slug: "hemngi-dhruvin",
		clientName: "Hemngi & Dhruvin",
		category: "Pre-Wedding",
		coverPhotoUrl: `${R2_URL}/images/feature/feature5.webp`,
		date: "2026-02-01",
		location: "Brampton, Canada",
		// description: "Luxury product photography for the MV lifestyle brand.",
		isFeatured: true,
		order: 5,
		media: [
			{ id: "c5_1", type: "photo", url: `${R2_URL}/images/clients/c5/c5_1.webp`, width: 1920, height: 1280, alt: "MV Collection 1" },
			{ id: "c5_2", type: "photo", url: `${R2_URL}/images/clients/c5/c5_2.webp`, width: 1920, height: 1280, alt: "MV Collection 2" },
			{ id: "c5_3", type: "photo", url: `${R2_URL}/images/clients/c5/c5_3.webp`, width: 1080, height: 1620, alt: "MV Collection 3" },
			{ id: "c5_4", type: "photo", url: `${R2_URL}/images/clients/c5/c5_4.webp`, width: 1080, height: 1620, alt: "MV Collection 4" },
			{ id: "c5_5", type: "photo", url: `${R2_URL}/images/clients/c5/c5_5.webp`, width: 1080, height: 1620, alt: "MV Collection 5" },
			{ id: "c5_6", type: "photo", url: `${R2_URL}/images/clients/c5/c5_6.webp`, width: 1920, height: 1280, alt: "MV Collection 6" },
			{ id: "c5_7", type: "photo", url: `${R2_URL}/images/clients/c5/c5_7.webp`, width: 1080, height: 1620, alt: "MV Collection 7" },
		],
	},
	{
		id: "g6",
		slug: "reepal",
		clientName: "Reepal",
		category: "Baby Shower",
		coverPhotoUrl: `${R2_URL}/images/feature/feature6.webp`,
		date: "2025-12-20",
		location: "Sarnia, Canada",
		// description: "A cinematic editorial couple portrait session in the pink city.",
		isFeatured: true,
		order: 6,
		media: [
			{ id: "c6_1", type: "photo", url: `${R2_URL}/images/clients/c6/c6_1.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 1" },
			{ id: "c6_2", type: "photo", url: `${R2_URL}/images/clients/c6/c6_2.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 2" },
			{ id: "c6_3", type: "photo", url: `${R2_URL}/images/clients/c6/c6_3.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 3" },
			{ id: "c6_4", type: "photo", url: `${R2_URL}/images/clients/c6/c6_4.webp`, width: 1920, height: 1280, alt: "Vidhi & Rushi 4" },
			{ id: "c6_5", type: "photo", url: `${R2_URL}/images/clients/c6/c6_5.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 5" },
			{ id: "c6_6", type: "photo", url: `${R2_URL}/images/clients/c6/c6_6.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 6" },
			{ id: "c6_7", type: "photo", url: `${R2_URL}/images/clients/c6/c6_7.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 7" },
			{ id: "c6_8", type: "photo", url: `${R2_URL}/images/clients/c6/c6_8.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 8" },
			{ id: "c6_9", type: "photo", url: `${R2_URL}/images/clients/c6/c6_9.webp`, width: 1080, height: 1620, alt: "Vidhi & Rushi 9" },
			{ id: "c6_10", type: "photo", url: `${R2_URL}/images/clients/c6/c6_10.webp`, width: 1920, height: 1280, alt: "Vidhi & Rushi 10" },
			{ id: "c6_11", type: "photo", url: `${R2_URL}/images/clients/c6/c6_11.webp`, width: 1920, height: 1280, alt: "Vidhi & Rushi 11" },
			// { id: "g6-v1", type: "video", url: `${R2_URL}/videos/portrait-1/portrait1.m3u8`, hlsUrl: `${R2_URL}/videos/portrait-1/portrait1.m3u8`, posterUrl: `${R2_URL}/images/thumbnail/t-portrait-1.webp`, width: 1080, height: 1920, duration: "1:55", alt: "Editorial reel" },
		],
	},
];

// ─────────────────────────────────────────────────────────
//  Helper Functions (future-proof for CMS fetching)
// ─────────────────────────────────────────────────────────

/** Get all galleries — replace with `fetch()` to CMS later */
export function getAllGalleries(): Gallery[] {
	return galleries.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Get a single gallery by slug */
export function getGalleryBySlug(slug: string): Gallery | undefined {
	return galleries.find((g) => g.slug === slug);
}

/** Get galleries grouped by category */
export function getGalleriesByCategory(): Record<GalleryCategory, Gallery[]> {
	const grouped = {} as Record<GalleryCategory, Gallery[]>;
	for (const gallery of getAllGalleries()) {
		if (!grouped[gallery.category]) {
			grouped[gallery.category] = [];
		}
		grouped[gallery.category].push(gallery);
	}
	return grouped;
}

/** Get all unique categories that have galleries */
export function getActiveCategories(): GalleryCategory[] {
	const cats = new Set<GalleryCategory>();
	for (const g of galleries) cats.add(g.category);
	return Array.from(cats);
}

/** Get featured galleries for Best-of-Us */
export function getFeaturedGalleries(): Gallery[] {
	return galleries.filter((g) => g.isFeatured);
}

/** Get all media items across featured galleries (for Best-of-Us page) */
export function getCuratedPhotos(): MediaItem[] {
	return getFeaturedGalleries()
		.flatMap((g) => g.media)
		.filter((m) => m.type === "photo");
}

/** Get all video media items (for Cinematography page) */
export function getCuratedVideos(): MediaItem[] {
	return galleries
		.flatMap((g) => g.media)
		.filter((m) => m.type === "video");
}

/** Generate static params for [clientSlug] route */
export function getAllGallerySlugs(): { clientSlug: string }[] {
	return galleries.map((g) => ({ clientSlug: g.slug }));
}
