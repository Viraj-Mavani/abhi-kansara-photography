import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getGalleries } from "@/lib/api";
import { deleteGallery } from "@/app/actions/galleries";
import AdminButton from "@/components/admin/ui/AdminButton";

// ─────────────────────────────────────────────────────────
//  Galleries List — Visual Card Grid
// ─────────────────────────────────────────────────────────

export default async function AdminGalleriesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_token")) redirect("/admin/login");

  const galleries = await getGalleries();

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
            Galleries
          </h1>
          <p className="text-sm text-white/40">
            Manage client project galleries
          </p>
        </div>
        <Link href="/admin/galleries/new">
          <AdminButton size="md">+ Add Gallery</AdminButton>
        </Link>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
          >
            {/* Cover Image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={gallery.coverPhotoUrl}
                alt={gallery.clientName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {gallery.isFeatured && (
                <span className="absolute top-3 right-3 h-5 px-2 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/30 text-[10px] font-bold text-[#c9a96e] uppercase tracking-wider leading-5 backdrop-blur-sm">
                  Featured
                </span>
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-semibold text-white truncate">
                  {gallery.clientName}
                </h3>
                <p className="text-xs text-white/50">{gallery.category}</p>
              </div>
            </div>

            {/* Info */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-mono">
                  {gallery.media?.length || 0} items
                </span>
                {gallery.location && (
                  <span className="text-xs text-white/25">
                    📍 {gallery.location}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/galleries/${gallery.id}`}>
                  <AdminButton variant="ghost" size="sm">
                    Edit
                  </AdminButton>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteGallery(gallery.id);
                  }}
                >
                  <AdminButton variant="danger" size="sm" type="submit">
                    Delete
                  </AdminButton>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {galleries.length === 0 && (
        <div className="text-center py-16 text-white/30 rounded-xl border border-white/[0.06]">
          <p className="text-sm">No galleries yet.</p>
          <Link href="/admin/galleries/new" className="text-[#c9a96e] text-sm hover:underline mt-2 inline-block">
            Create your first gallery
          </Link>
        </div>
      )}
    </div>
  );
}
