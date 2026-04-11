import { cookies } from "next/headers";

// ─────────────────────────────────────────────────────────
//  Admin API Client — Server-Side Only
//  Reads the JWT from the HttpOnly cookie and forwards it
//  as an Authorization header to the .NET backend.
// ─────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5027/api";

/**
 * Read the admin JWT from the HttpOnly cookie.
 * Returns null if no cookie is set (unauthenticated).
 */
export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value ?? null;
}

/**
 * Authenticated fetch wrapper for admin mutations.
 * Automatically attaches the Bearer token from the cookie.
 * Throws on non-OK responses with a descriptive message.
 */
async function adminFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAdminToken();

  if (!token) {
    throw new Error("Not authenticated — no admin token found.");
  }

  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "No error details");
    throw new Error(
      `Admin API error: ${res.status} ${res.statusText} at ${url}\n${errorText}`
    );
  }

  // 204 No Content — return void
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────
//  Services
// ─────────────────────────────────────────────────────────

export const adminServices = {
  create: (data: unknown) =>
    adminFetch("/services", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    adminFetch(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) =>
    adminFetch(`/services/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────────────────
//  Galleries
// ─────────────────────────────────────────────────────────

export const adminGalleries = {
  create: (data: unknown) =>
    adminFetch("/galleries", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    adminFetch(`/galleries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    adminFetch(`/galleries/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────────────────
//  Carousel
// ─────────────────────────────────────────────────────────

export const adminCarousel = {
  create: (data: unknown) =>
    adminFetch("/carousel", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    adminFetch(`/carousel/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    adminFetch(`/carousel/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────────────────
//  Site Config
// ─────────────────────────────────────────────────────────

export const adminSiteConfig = {
  updateBio: (id: string, data: unknown) =>
    adminFetch(`/siteconfig/bio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updatePageConfig: (id: string, data: unknown) =>
    adminFetch(`/siteconfig/page/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ─────────────────────────────────────────────────────────
//  Hero Backgrounds
// ─────────────────────────────────────────────────────────

export const adminHero = {
  create: (data: unknown) =>
    adminFetch("/HeroBackgrounds", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    adminFetch(`/HeroBackgrounds/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    adminFetch(`/HeroBackgrounds/${id}`, { method: "DELETE" }),
};
