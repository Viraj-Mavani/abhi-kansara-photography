"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ExternalLink, MapPin, AlertTriangle, Layers } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { deleteGallery } from "@/app/actions/galleries";
import type { Gallery } from "@/lib/api";

// ─────────────────────────────────────────────────────────
//  GalleryList — Managed list for Admin Galleries
//  Implements "Replace Row/Card" deletion UX.
// ─────────────────────────────────────────────────────────

interface GalleryListProps {
  initialGalleries: Gallery[];
}

export default function GalleryList({ initialGalleries }: GalleryListProps) {
  const [galleries, setGalleries] = useState(initialGalleries);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setError("");

    startTransition(async () => {
      try {
        await deleteGallery(idToDelete);
        setGalleries((prev) => prev.filter((g) => g.id !== idToDelete));
        setConfirmDeleteId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete gallery");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => {
          const isConfirming = confirmDeleteId === gallery.id;

          return (
            <div
              key={gallery.id}
              className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                isConfirming
                  ? "border-red-500/40 bg-red-500/[0.04] shadow-2xl shadow-red-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg"
              }`}
            >
              {isConfirming ? (
                /* ── Inline Confirmation UX (Replaces Card Content) ── */
                <div className="h-full min-h-[220px] p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-7 w-7 text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">Delete Gallery?</h3>
                  <p className="text-xs text-white/40 mb-6 max-w-[200px]">
                    This will permanently remove "{gallery.clientName}" and all associated media.
                  </p>
                  <div className="flex items-center gap-3 w-full">
                    <AdminButton
                      variant="ghost"
                      className="flex-1 text-white/30 hover:text-white"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isPending}
                    >
                      Cancel
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      className="flex-1"
                      onClick={handleConfirmDelete}
                      isLoading={isPending}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
              ) : (
                /* ── Normal Card UX ── */
                <>
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={gallery.coverPhotoUrl}
                      alt={gallery.clientName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    {/* Featured Badge */}
                    {gallery.isFeatured && (
                      <span className="absolute top-4 right-4 h-6 px-3 rounded-full bg-[#c9a96e] text-black text-[10px] font-bold uppercase tracking-wider leading-6 shadow-xl">
                        Featured
                      </span>
                    )}

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight truncate">
                        {gallery.clientName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e]/90">
                          {gallery.category}
                        </span>
                        {gallery.shootDate && (
                          <span className="text-[10px] text-white/40 font-medium">
                            • {new Date(gallery.shootDate).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-white/40">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <Layers size={14} className="opacity-50" />
                          <span className="text-xs font-mono tracking-tight">{gallery.media?.length || 0} media</span>
                        </div>
                        {gallery.location && (
                          <div className="flex items-center gap-1 text-xs truncate max-w-[120px]">
                            <MapPin size={12} />
                            <span className="truncate">{gallery.location}</span>
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/portfolio/${gallery.slug}`} 
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-[#c9a96e] transition-all"
                        title="View Public Link"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/galleries/${gallery.id}`} className="flex-1">
                        <AdminButton variant="ghost" size="sm" className="w-full border-white/5 hover:border-white/10">
                          Edit Gallery
                        </AdminButton>
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(gallery.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-white/20 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all"
                        title="Delete Gallery"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {galleries.length === 0 && (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-white/[0.06] bg-white/[0.01]">
          <p className="text-white/20 text-sm font-medium">No galleries have been created yet.</p>
          <Link href="/admin/galleries/new" className="mt-4 inline-block">
            <AdminButton variant="ghost" size="sm">Create First Gallery</AdminButton>
          </Link>
        </div>
      )}
    </div>
  );
}
