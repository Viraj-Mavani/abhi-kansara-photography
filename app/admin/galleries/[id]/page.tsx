import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getGalleries } from "@/lib/api";
import GalleryForm from "@/components/admin/galleries/GalleryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: PageProps) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const { id } = await params;
  const galleries = await getGalleries();
  const gallery = galleries.find((g) => g.id === id);

  if (!gallery) notFound();

  return <GalleryForm initialData={gallery} />;
}
