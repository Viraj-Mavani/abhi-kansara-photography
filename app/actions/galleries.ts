"use server";

import { revalidatePath } from "next/cache";
import { adminGalleries } from "@/lib/admin-api";

// ─────────────────────────────────────────────────────────
//  Galleries Server Actions
//  Called from GalleryEditor and GalleryList components.
//  Navigation is now handled in the Client Component to 
//  avoid the "NEXT_REDIRECT" error in try..catch blocks.
// ─────────────────────────────────────────────────────────

export async function createGallery(data: unknown) {
  await adminGalleries.create(data);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  // Navigation handled in Client Component (router.push)
}

export async function updateGallery(id: string, data: unknown) {
  await adminGalleries.update(id, data);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  // Navigation handled in Client Component (router.push)
}

export async function deleteGallery(id: string) {
  await adminGalleries.delete(id);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  // List updates locally, no redirect needed
}
