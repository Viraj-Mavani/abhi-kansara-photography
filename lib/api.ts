// ─────────────────────────────────────────────────────────
//  Type Definitions — Services Domain
// ─────────────────────────────────────────────────────────

export interface ServiceFAQ {
  id?: string;
  question: string;
  answer: string;
}

export interface ServiceProcess {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceTestimonial {
  id?: string;
  clientName: string;
  event?: string;
  quote: string;
  rating?: number;
  avatar?: string;
}

export interface DetailedService {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  coverImage: string;
  icon?: string;
  shortDescription: string;
  detailedDescription: string;
  features: string[];
  highlights?: string[];
  processSteps: ServiceProcess[]; // Renamed from process to match C# property
  testimonials?: ServiceTestimonial[];
  faqs: ServiceFAQ[];
  galleryImages: string[];
  category?: string;
  order?: number;
  isFeatured?: boolean;
}

// ─────────────────────────────────────────────────────────
//  Type Definitions — Portfolio Domain
// ─────────────────────────────────────────────────────────

export type GalleryCategory =
  | "Wedding"
  | "Pre-Wedding"
  | "Baby Shower"
  | "Event"
  | "Product"
  | "Editorial"
  | "Portrait";

export interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  width: number;
  height: number;
  alt?: string;
  posterUrl?: string;
  hlsUrl?: string;
  duration?: string;
}

export interface Gallery {
  id: string;
  slug: string;
  clientName: string;
  category: GalleryCategory;
  coverPhotoUrl: string;
  shootDate?: string;
  location?: string;
  description?: string;
  media: MediaItem[];
  isFeatured?: boolean;
  order?: number;
}


// Base API URL with fallback for local dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5027/api';

// Configuration for Next.js 15+ Server Components fetch
// Set to 'no-store' during development for instant updates
const FETCH_CONFIG: RequestInit = {
  cache: 'no-store', 
  // Next.js 15 ISR: next: { revalidate: 3600 } 
};

/** Ensure API errors throw so we fail fast locally */
async function fetchWithFailFast<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...FETCH_CONFIG, ...options });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'No error text');
    throw new Error(`Admin API error: ${res.status} ${res.statusText} at ${url}\n${errorText}`);
  }
  
  return res.json();
}

// ─────────────────────────────────────────────────────────
//  Extended Types (Migrating from legacy data)
// ─────────────────────────────────────────────────────────

export interface SiteBio {
  id: string;
  artistName: string;
  tagline: string;
  intro: string;
  history: string;
  philosophy: string;
  portraitImage: string;
}

export interface PageConfig {
  id: string;
  pageKey: string;
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText?: string;
  ctaLink?: string;
  heroInterval?: number; // Added for landing page pacing
}

export interface HeroBackground {
  id: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

// ─────────────────────────────────────────────────────────
//  Fetching Functions
// ─────────────────────────────────────────────────────────

export async function getServices(): Promise<DetailedService[]> {
  return fetchWithFailFast<DetailedService[]>(`${API_URL}/services`);
}

export async function getServiceBySlug(slug: string): Promise<DetailedService> {
  return fetchWithFailFast<DetailedService>(`${API_URL}/services/${slug}`);
}

export async function getGalleries(): Promise<Gallery[]> {
  return fetchWithFailFast<Gallery[]>(`${API_URL}/galleries`);
}

export async function getFeaturedGalleries(): Promise<Gallery[]> {
  return fetchWithFailFast<Gallery[]>(`${API_URL}/galleries/featured`);
}

export async function getGalleryBySlug(slug: string): Promise<Gallery> {
  return fetchWithFailFast<Gallery>(`${API_URL}/galleries/${slug}`);
}
// ─────────────────────────────────────────────────────────
//  Carousel Items API
// ─────────────────────────────────────────────────────────

export interface CarouselItem {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
}

export async function getCarouselItems(): Promise<CarouselItem[]> {
  return fetchWithFailFast<CarouselItem[]>(`${API_URL}/carousel`);
}
export async function getBio(): Promise<SiteBio> {
  return fetchWithFailFast<SiteBio>(`${API_URL}/siteconfig/bio`);
}

export async function getPageConfig(pageKey: string): Promise<PageConfig> {
  return fetchWithFailFast<PageConfig>(`${API_URL}/siteconfig/page/${pageKey}`);
}

export async function getHeroBackgrounds(): Promise<HeroBackground[]> {
  return fetchWithFailFast<HeroBackground[]>(`${API_URL}/HeroBackgrounds`).catch(() => []);
}
