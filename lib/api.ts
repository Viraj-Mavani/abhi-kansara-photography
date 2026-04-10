import type { DetailedService } from './services';
import type { Gallery } from './portfolio';

export type { DetailedService, Gallery };

// Base API URL with fallback for local dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5027/api';

// Configuration for Next.js 15+ Server Components fetch
// Set to 'no-store' during development for instant updates
const FETCH_CONFIG: RequestInit = {
  cache: 'no-store', 
  // Next.js 15 ISR: next: { revalidate: 3600 } 
};

/** Ensure API errors throw so we fail fast locally */
async function fetchWithFailFast(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...FETCH_CONFIG, ...options });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'No error text');
    throw new Error(`API Fetch failed: ${res.status} ${res.statusText} at ${url}\n${errorText}`);
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
  sectionTitle1?: string;
  sectionSubtitle1?: string;
  sectionTitle2?: string;
  sectionSubtitle2?: string;
}

// ─────────────────────────────────────────────────────────
//  Fetching Functions
// ─────────────────────────────────────────────────────────

export async function getServices(): Promise<DetailedService[]> {
  return fetchWithFailFast(`${API_URL}/services`);
}

export async function getServiceBySlug(slug: string): Promise<DetailedService> {
  return fetchWithFailFast(`${API_URL}/services/${slug}`);
}

export async function getGalleries(): Promise<Gallery[]> {
  return fetchWithFailFast(`${API_URL}/galleries`);
}

export async function getFeaturedGalleries(): Promise<Gallery[]> {
  return fetchWithFailFast(`${API_URL}/galleries/featured`);
}

export async function getGalleryBySlug(slug: string): Promise<Gallery> {
  return fetchWithFailFast(`${API_URL}/galleries/${slug}`);
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
  return fetchWithFailFast(`${API_URL}/siteconfig/bio`);
}

export async function getPageConfig(pageKey: string): Promise<PageConfig> {
  return fetchWithFailFast(`${API_URL}/siteconfig/page/${pageKey}`);
}
