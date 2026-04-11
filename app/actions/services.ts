"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminServices,
} from "@/lib/admin-api";

// ─────────────────────────────────────────────────────────
//  Service Server Actions
//  Called from ServiceForm and ServicesList components.
// ─────────────────────────────────────────────────────────

export async function createService(data: unknown) {
  await adminServices.create(data);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function updateService(id: string, data: unknown) {
  await adminServices.update(id, data);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await adminServices.delete(id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}
