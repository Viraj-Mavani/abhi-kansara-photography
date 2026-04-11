"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminGalleries } from "@/lib/admin-api";

export async function createGallery(data: unknown) {
  await adminGalleries.create(data);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  redirect("/admin/galleries");
}

export async function updateGallery(id: string, data: unknown) {
  await adminGalleries.update(id, data);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  redirect("/admin/galleries");
}

export async function deleteGallery(id: string) {
  await adminGalleries.delete(id);
  revalidatePath("/admin/galleries");
  revalidatePath("/portfolio");
  redirect("/admin/galleries");
}
