"use server";

import { revalidatePath } from "next/cache";
import { adminHero, adminSiteConfig } from "@/lib/admin-api";

export async function createHeroBackground(data: unknown) {
  try {
    await adminHero.create(data);
    revalidatePath("/admin/hero");
    revalidatePath("/");
  } catch (error) {
    console.error("Action error [createHeroBackground]:", error);
    throw error;
  }
}

export async function updateHeroBackground(id: string, data: unknown) {
  try {
    await adminHero.update(id, data);
    revalidatePath("/admin/hero");
    revalidatePath("/");
  } catch (error) {
    console.error("Action error [updateHeroBackground]:", error);
    throw error;
  }
}

export async function deleteHeroBackground(id: string) {
  try {
    console.log(`Attempting to delete HeroBackground with ID: ${id}`);
    await adminHero.delete(id);
    revalidatePath("/admin/hero");
    revalidatePath("/");
  } catch (error) {
    console.error("Action error [deleteHeroBackground]:", error);
    throw error;
  }
}

export async function updateHomeConfig(id: string, data: unknown) {
  try {
    await adminSiteConfig.updatePageConfig(id, data);
    revalidatePath("/admin/hero");
    revalidatePath("/");
  } catch (error) {
    console.error("Action error [updateHomeConfig]:", error);
    throw error;
  }
}
