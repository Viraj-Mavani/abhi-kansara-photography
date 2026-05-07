"use server";

import { adminBookings } from "@/lib/admin-api";
import { revalidatePath } from "next/cache";

export async function getAllBookings(start?: string, end?: string) {
  return await adminBookings.getAll(start, end);
}

export async function createBookingAction(data: unknown) {
  const result = await adminBookings.create(data);
  revalidatePath("/admin/calendar");
  return result;
}

export async function updateBookingAction(id: string, data: unknown) {
  const result = await adminBookings.update(id, data);
  revalidatePath("/admin/calendar");
  return result;
}

export async function deleteBookingAction(id: string) {
  await adminBookings.delete(id);
  revalidatePath("/admin/calendar");
}
