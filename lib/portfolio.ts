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
	width: number; // Original width — essential for justified grid math
	height: number; // Original height — essential for justified grid math
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
		slug: "aaina-daideep",
		clientName: "Aaina & Daideep",
		category: "Wedding",
		coverPhotoUrl: `${R2_URL}/images/feature/feature0.webp`,
		date: "2024-12-15",
		location: "Udaipur, India",
		description:
			"A magical winter wedding set against the regal backdrop of Udaipur's lakeside palaces.",
		isFeatured: true,
		order: 1,
		media: [
			{
				id: "g1-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature0.webp`,
				width: 1200,
				height: 1800,
				alt: "Bride portrait",
			},
			{
				id: "g1-p2",
				type: "photo",
				url: `${R2_URL}/images/work/work0.webp`,
				width: 1800,
				height: 1200,
				alt: "Wedding ceremony",
			},
			{
				id: "g1-p3",
				type: "photo",
				url: `${R2_URL}/images/work/work4.webp`,
				width: 1600,
				height: 1200,
				alt: "Reception decor",
			},
			{
				id: "g1-p4",
				type: "photo",
				url: `${R2_URL}/images/work/work11.webp`,
				width: 1200,
				height: 1600,
				alt: "Couple portrait",
			},
			{
				id: "g1-p5",
				type: "photo",
				url: `${R2_URL}/images/bg/bg0.webp`,
				width: 1920,
				height: 1080,
				alt: "Venue wide shot",
			},
			{
				id: "g1-p6",
				type: "photo",
				url: `${R2_URL}/images/bg/bg1.webp`,
				width: 1080,
				height: 1920,
				alt: "Detail shot",
			},
			{
				id: "g1-v1",
				type: "video",
				url: `${R2_URL}/videos/portrait-0/portrait0.m3u8`,
				hlsUrl: `${R2_URL}/videos/portrait-0/portrait0.m3u8`,
				posterUrl: `${R2_URL}/images/thumbnail/t-portrait-0.webp`,
				width: 1080,
				height: 1920,
				duration: "1:42",
				alt: "Wedding highlight reel",
			},
		],
	},
	{
		id: "g2",
		slug: "sapan-sajnee",
		clientName: "Sapan & Sajnee",
		category: "Pre-Wedding",
		coverPhotoUrl: `${R2_URL}/images/feature/feature1.webp`,
		date: "2024-11-20",
		location: "Goa, India",
		description:
			"Sun-soaked pre-wedding sessions along the golden shores of Goa.",
		isFeatured: true,
		order: 2,
		media: [
			{
				id: "g2-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature1.webp`,
				width: 1800,
				height: 1200,
				alt: "Couple walking on beach",
			},
			{
				id: "g2-p2",
				type: "photo",
				url: `${R2_URL}/images/bg/bg2.webp`,
				width: 1920,
				height: 1080,
				alt: "Golden hour portrait",
			},
			{
				id: "g2-p3",
				type: "photo",
				url: `${R2_URL}/images/bg/bg3.webp`,
				width: 1200,
				height: 1800,
				alt: "Sunset silhouette",
			},
			{
				id: "g2-p4",
				type: "photo",
				url: `${R2_URL}/images/work/work5.webp`,
				width: 1600,
				height: 1200,
				alt: "Candid moment",
			},
			{
				id: "g2-v1",
				type: "video",
				url: `${R2_URL}/videos/landscape-0/landscape0.m3u8`,
				hlsUrl: `${R2_URL}/videos/landscape-0/landscape0.m3u8`,
				posterUrl: `${R2_URL}/images/thumbnail/t-landscape-0.webp`,
				width: 1920,
				height: 1080,
				duration: "2:18",
				alt: "Pre-wedding film",
			},
		],
	},
	{
		id: "g3",
		slug: "aditya-gadhvi-live",
		clientName: "Aditya Gadhvi Live",
		category: "Event",
		coverPhotoUrl: `${R2_URL}/images/feature/feature2.webp`,
		date: "2025-01-10",
		location: "Ahmedabad, India",
		description:
			"Capturing the electric atmosphere at a sold-out Aditya Gadhvi concert.",
		isFeatured: true,
		order: 3,
		media: [
			{
				id: "g3-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature2.webp`,
				width: 1800,
				height: 1200,
				alt: "Stage performance",
			},
			{
				id: "g3-p2",
				type: "photo",
				url: `${R2_URL}/images/work/work1.webp`,
				width: 1920,
				height: 1080,
				alt: "Audience wide shot",
			},
			{
				id: "g3-p3",
				type: "photo",
				url: `${R2_URL}/images/work/work6.webp`,
				width: 1200,
				height: 1800,
				alt: "Backstage moment",
			},
			{
				id: "g3-p4",
				type: "photo",
				url: `${R2_URL}/images/work/work7.webp`,
				width: 1800,
				height: 1200,
				alt: "Crowd energy",
			},
			{
				id: "g3-p5",
				type: "photo",
				url: `${R2_URL}/images/work/work8.webp`,
				width: 1600,
				height: 1200,
				alt: "Lighting setup",
			},
		],
	},
	{
		id: "g4",
		slug: "vidhi-kashyap",
		clientName: "Vidhi & Kashyap",
		category: "Baby Shower",
		coverPhotoUrl: `${R2_URL}/images/feature/feature3.webp`,
		date: "2025-02-14",
		location: "Surat, India",
		description:
			"An intimate, joyful baby shower celebration dripping with love and laughter.",
		isFeatured: false,
		order: 4,
		media: [
			{
				id: "g4-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature3.webp`,
				width: 1800,
				height: 1200,
				alt: "Celebration moment",
			},
			{
				id: "g4-p2",
				type: "photo",
				url: `${R2_URL}/images/work/work13.webp`,
				width: 1200,
				height: 1800,
				alt: "Decor details",
			},
			{
				id: "g4-p3",
				type: "photo",
				url: `${R2_URL}/images/bg/bg4.webp`,
				width: 1920,
				height: 1080,
				alt: "Family portrait",
			},
			{
				id: "g4-p4",
				type: "photo",
				url: `${R2_URL}/images/bg/bg5.webp`,
				width: 1080,
				height: 1920,
				alt: "Candid laughter",
			},
		],
	},
	{
		id: "g5",
		slug: "mv-collection",
		clientName: "MV Collection",
		category: "Product",
		coverPhotoUrl: `${R2_URL}/images/feature/feature4.webp`,
		date: "2025-03-01",
		location: "Studio, Ahmedabad",
		description:
			"Luxury product photography for the MV lifestyle brand.",
		isFeatured: false,
		order: 5,
		media: [
			{
				id: "g5-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature4.webp`,
				width: 1200,
				height: 1200,
				alt: "Product hero shot",
			},
			{
				id: "g5-p2",
				type: "photo",
				url: `${R2_URL}/images/work/work2.webp`,
				width: 1800,
				height: 1200,
				alt: "Product lifestyle",
			},
			{
				id: "g5-p3",
				type: "photo",
				url: `${R2_URL}/images/work/work9.webp`,
				width: 1600,
				height: 1200,
				alt: "Detail macro",
			},
		],
	},
	{
		id: "g6",
		slug: "vidhi-rushi",
		clientName: "Vidhi & Rushi",
		category: "Editorial",
		coverPhotoUrl: `${R2_URL}/images/feature/feature5.webp`,
		date: "2024-10-05",
		location: "Jaipur, India",
		description:
			"A cinematic editorial couple portrait session in the pink city.",
		isFeatured: true,
		order: 6,
		media: [
			{
				id: "g6-p1",
				type: "photo",
				url: `${R2_URL}/images/feature/feature5.webp`,
				width: 1200,
				height: 1800,
				alt: "Editorial portrait",
			},
			{
				id: "g6-p2",
				type: "photo",
				url: `${R2_URL}/images/work/work3.webp`,
				width: 1800,
				height: 1200,
				alt: "Architecture blend",
			},
			{
				id: "g6-p3",
				type: "photo",
				url: `${R2_URL}/images/work/work10.webp`,
				width: 1200,
				height: 1800,
				alt: "Fashion editorial",
			},
			{
				id: "g6-p4",
				type: "photo",
				url: `${R2_URL}/images/work/work12.webp`,
				width: 1800,
				height: 1200,
				alt: "Candid editorial",
			},
			{
				id: "g6-v1",
				type: "video",
				url: `${R2_URL}/videos/portrait-1/portrait1.m3u8`,
				hlsUrl: `${R2_URL}/videos/portrait-1/portrait1.m3u8`,
				posterUrl: `${R2_URL}/images/thumbnail/t-portrait-1.webp`,
				width: 1080,
				height: 1920,
				duration: "1:55",
				alt: "Editorial reel",
			},
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
