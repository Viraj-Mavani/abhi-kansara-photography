import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getGalleries } from "@/lib/api";
import AdminButton from "@/components/admin/ui/AdminButton";
import GalleryList from "@/components/admin/galleries/GalleryList";
import { Plus } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Admin Galleries Page — Secure Server Wrapper
// ─────────────────────────────────────────────────────────

export default async function AdminGalleriesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const galleries = await getGalleries();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Galleries
          </h1>
          <p className="text-sm text-white/40 font-medium">
            Manage client project galleries and featured showcase items.
          </p>
        </div>
        <Link href="/admin/galleries/new">
          <AdminButton size="md" className="shadow-lg shadow-[#c9a96e]/10">
            <Plus className="h-4 w-4 mr-2" />
            Add New Gallery
          </AdminButton>
        </Link>
      </div>

      {/* Optimized Gallery List (Client Side Interactions) */}
      <GalleryList initialGalleries={galleries} />
    </div>
  );
}
