/**
 * BEST OF US - DATA STRUCTURE
 * ---------------------------
 * This file contains the manually curated photos for the "Best of Us" section.
 * 
 * PHOTO URL PATTERN:
 * Use unique placeholders for now. Example:
 * images/best-of-us/photo-1.webp, images/best-of-us/photo-2.webp, etc.
 * 
 * FLEXIBLE DIMENSIONS:
 * width and height are optional. If left out, the grid defaults to a 3:2 landscape ratio.
 * For portrait, set width: 2 and height: 3.
 */

import { galleries, MediaItem } from "./portfolio";

/**
 * BEST OF US - AUTOMATED SELECTION
 * --------------------------------
 * Automatically picks the first 3 photos from each of the 6 client galleries.
 * Total: 18 curated photos.
 */
export const bestOfUsPhotos: MediaItem[] = galleries.flatMap((gallery) =>
	gallery.media
		.filter((item) => item.type === "photo")
		.slice(0, 3)
);

