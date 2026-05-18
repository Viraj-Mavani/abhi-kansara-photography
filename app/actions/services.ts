"use server";

import { revalidatePath } from "next/cache";
import {
  adminServices,
} from "@/lib/admin-api";
import { getServices } from "@/lib/api";

// ─────────────────────────────────────────────────────────
//  Service Server Actions
//  Called from ServiceForm and ServicesList components.
//  Navigation is now handled in the Client Component to 
//  avoid the "NEXT_REDIRECT" error in try..catch blocks.
// ─────────────────────────────────────────────────────────

export async function createService(data: any) {
  try {
    const services = await getServices();
    data.order = services.length;
  } catch {
    data.order = 0;
  }
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

export async function reorderServices(ids: string[]) {
  await adminServices.reorder(ids);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
