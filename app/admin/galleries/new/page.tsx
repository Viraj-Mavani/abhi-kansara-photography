import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GalleryForm from "@/components/admin/galleries/GalleryForm";

export default async function NewGalleryPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  return <GalleryForm />;
}
