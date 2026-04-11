"use server";

import { revalidatePath } from "next/cache";
import { adminCarousel } from "@/lib/admin-api";

export async function createCarouselItem(data: unknown) {
  await adminCarousel.create(data);
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function updateCarouselItem(id: string, data: unknown) {
  await adminCarousel.update(id, data);
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function deleteCarouselItem(id: string) {
  await adminCarousel.delete(id);
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}
