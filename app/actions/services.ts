"use server";

import { revalidatePath } from "next/cache";
import {
  adminServices,
} from "@/lib/admin-api";

// ─────────────────────────────────────────────────────────
//  Service Server Actions
//  Called from ServiceForm and ServicesList components.
//  Navigation is now handled in the Client Component to 
//  avoid the "NEXT_REDIRECT" error in try..catch blocks.
// ─────────────────────────────────────────────────────────

export async function createService(data: unknown) {
  await adminServices.create(data);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  // Navigation handled in Client Component (router.push)
}

export async function updateService(id: string, data: unknown) {
  await adminServices.update(id, data);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  // Navigation handled in Client Component (router.push)
}

export async function deleteService(id: string) {
  await adminServices.delete(id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  // List updates locally, no redirect needed
}
