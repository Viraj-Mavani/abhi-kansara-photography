/**
 * R2 STORAGE CONFIGURATION
 * ──────────────────────────────────────────────────────────
 * Centralized configuration for R2 bucket assets.
 * 
 * CACHE BUSTING: 
 * If you update a photo on R2 with the SAME name, increment 
 * the ASSET_VERSION below to force Next.js and browsers to 
 * fetch the latest version.
 */

export const R2_BASE_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

// Bump this number (e.g. "1.1", "2") whenever you re-upload images with same names
export const ASSET_VERSION = "1.0.1";

/**
 * Helper to build an R2 URL with cache-busting versioning.
 * @param path - The path to the asset (e.g., "/images/feature/feature1.webp")
 * @returns The full URL with ?v=VERSION appended
 */
export function getR2Url(path: string): string {
	// Clean path to ensure it starts with /
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	
	// Add versioning query param
	// If it's a video/hls, we might want to skip versioning if it causes issues, 
	// but generally ?v= works fine for CDN busting.
	return `${R2_BASE_URL}${cleanPath}?v=${ASSET_VERSION}`;
}
