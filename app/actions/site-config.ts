"use server";

import { revalidatePath } from "next/cache";
import { adminSiteConfig } from "@/lib/admin-api";

export async function updateBio(id: string, data: unknown) {
  await adminSiteConfig.updateBio(id, data);
  revalidatePath("/admin/site-config");
  revalidatePath("/about");
}

export async function updatePageConfig(id: string, data: unknown) {
  await adminSiteConfig.updatePageConfig(id, data);
  revalidatePath("/admin/site-config");
  revalidatePath("/services");
  revalidatePath("/portfolio");
}
