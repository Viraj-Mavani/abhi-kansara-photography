"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ExternalLink, MapPin, AlertTriangle, Layers, GripVertical } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { deleteGallery, reorderGalleries } from "@/app/actions/galleries";
import type { Gallery } from "@/lib/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─────────────────────────────────────────────────────────
//  Shared Types & Helpers
// ─────────────────────────────────────────────────────────

interface GalleryListProps {
  initialGalleries: Gallery[];
}

// ─────────────────────────────────────────────────────────
//  Sortable Gallery Card
// ─────────────────────────────────────────────────────────

interface SortableGalleryCardProps {
  gallery: Gallery;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  handleConfirmDelete: () => void;
  isPending: boolean;
}

function SortableGalleryCard({
  gallery,
  confirmDeleteId,
  setConfirmDeleteId,
  handleConfirmDelete,
  isPending,
}: SortableGalleryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gallery.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isConfirming = confirmDeleteId === gallery.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
        isConfirming
          ? "border-red-500/40 bg-red-500/[0.04] shadow-2xl shadow-red-500/10"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg"
      }`}
    >
      {isConfirming ? (
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

            {/* Drag Handle */}
            <div
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="absolute top-4 left-4 h-8 w-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing text-white/50 hover:text-white hover:bg-black/60 border border-white/10 transition-all z-10 touch-none shadow-lg"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>

            {/* Featured Badge */}
            <span className="absolute top-4 right-4 h-6 px-3 rounded-full bg-[#c9a96e] text-black text-[10px] font-bold uppercase tracking-wider leading-6 shadow-xl z-10">
              Featured
            </span>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
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
                href={`/portfolio/clients/${gallery.slug}`}
                target="_blank"
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-[#c9a96e] transition-all z-10"
                title="View Public Link"
              >
                <ExternalLink size={14} />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/galleries/${gallery.id}`} className="flex-1 z-10">
                <AdminButton variant="ghost" size="sm" className="w-full border-white/5 hover:border-white/10 pointer-events-auto">
                  Edit Gallery
                </AdminButton>
              </Link>
              <button
                onClick={() => setConfirmDeleteId(gallery.id)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-white/20 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all z-10 pointer-events-auto"
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
}

// ─────────────────────────────────────────────────────────
//  Static Gallery Card (For non-featured)
// ─────────────────────────────────────────────────────────

interface GalleryCardProps {
  gallery: Gallery;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  handleConfirmDelete: () => void;
  isPending: boolean;
}

function GalleryCard({
  gallery,
  confirmDeleteId,
  setConfirmDeleteId,
  handleConfirmDelete,
  isPending,
}: GalleryCardProps) {
  const isConfirming = confirmDeleteId === gallery.id;

  return (
    <div
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
        isConfirming
          ? "border-red-500/40 bg-red-500/[0.04] shadow-2xl shadow-red-500/10"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg"
      }`}
    >
      {isConfirming ? (
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
        <>
          <div className="relative h-48 overflow-hidden">
            <Image
              src={gallery.coverPhotoUrl}
              alt={gallery.clientName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <h3 className="text-lg font-bold text-white tracking-tight leading-tight truncate">
                {gallery.clientName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
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
                href={`/portfolio/clients/${gallery.slug}`}
                target="_blank"
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all pointer-events-auto"
                title="View Public Link"
              >
                <ExternalLink size={14} />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/galleries/${gallery.id}`} className="flex-1 pointer-events-auto">
                <AdminButton variant="ghost" size="sm" className="w-full border-white/5 hover:border-white/10">
                  Edit Gallery
                </AdminButton>
              </Link>
              <button
                onClick={() => setConfirmDeleteId(gallery.id)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-white/20 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all pointer-events-auto"
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
}

// ─────────────────────────────────────────────────────────
//  Main GalleryList Component
// ─────────────────────────────────────────────────────────

export default function GalleryList({ initialGalleries }: GalleryListProps) {
  const [galleries, setGalleries] = useState(initialGalleries);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const featuredGalleries = galleries.filter((g) => g.isFeatured);
  const standardGalleries = galleries.filter((g) => !g.isFeatured);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = featuredGalleries.findIndex((g) => g.id === active.id);
    const newIndex = featuredGalleries.findIndex((g) => g.id === over.id);

    const newFeatured = arrayMove(featuredGalleries, oldIndex, newIndex);
    
    // Update local state instantly for optimistic UI
    setGalleries([...newFeatured, ...standardGalleries]);
    setIsSavingOrder(true);
    setError("");

    try {
      await reorderGalleries(newFeatured.map((g) => g.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save new order.");
      // Revert on failure
      setGalleries(initialGalleries);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const activeGallery = activeDragId ? galleries.find((g) => g.id === activeDragId) : null;

  return (
    <div className="space-y-12">
      {/* Absolute Loading Indicator */}
      <div
        className={`fixed top-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/30 px-4 py-2 text-[#c9a96e] shadow-lg backdrop-blur-md transition-all duration-300 ${
          isSavingOrder ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="text-sm font-semibold tracking-wide">Saving order...</span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Featured Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Featured Galleries</h2>
            <p className="text-xs text-white/40 mt-1">Displayed on the landing page and portfolio top. Drag to reorder.</p>
          </div>
          <span className="text-xs font-mono text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-1 rounded">
            {featuredGalleries.length} items
          </span>
        </div>

        {featuredGalleries.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={featuredGalleries.map((g) => g.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGalleries.map((gallery) => (
                  <SortableGalleryCard
                    key={gallery.id}
                    gallery={gallery}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                    handleConfirmDelete={handleConfirmDelete}
                    isPending={isPending}
                  />
                ))}
              </div>
            </SortableContext>
            
            {/* Drag Overlay for smooth premium dragging effect */}
            {isMounted && (
              <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ duration: 250, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" })}>
                {activeGallery ? (
                  <div className="rounded-2xl border border-[#c9a96e]/40 bg-black shadow-2xl shadow-[#c9a96e]/20 opacity-90 scale-105 transition-transform overflow-hidden cursor-grabbing">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={activeGallery.coverPhotoUrl}
                        alt={activeGallery.clientName}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 h-8 w-8 bg-[#c9a96e] rounded-lg flex items-center justify-center text-black z-10 shadow-lg">
                        <GripVertical size={16} />
                      </div>
                      <span className="absolute top-4 right-4 h-6 px-3 rounded-full bg-[#c9a96e] text-black text-[10px] font-bold uppercase tracking-wider leading-6 shadow-xl z-10">
                        Featured
                      </span>
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className="text-lg font-bold text-white tracking-tight leading-tight truncate">
                          {activeGallery.clientName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e]/90">
                            {activeGallery.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-4 bg-white/[0.02]">
                      <div className="flex items-center justify-between text-white/40">
                        <div className="flex items-center gap-1.5">
                          <Layers size={14} className="opacity-50" />
                          <span className="text-xs font-mono tracking-tight">{activeGallery.media?.length || 0} media</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AdminButton variant="ghost" size="sm" className="flex-1 pointer-events-none opacity-50">
                          Edit Gallery
                        </AdminButton>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            )}
          </DndContext>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01]">
            <p className="text-white/20 text-sm font-medium">No featured galleries available.</p>
          </div>
        )}
      </section>

      {/* Standard Galleries Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Standard Galleries</h2>
            <p className="text-xs text-white/40 mt-1">Organized by last updated date.</p>
          </div>
          <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded">
            {standardGalleries.length} items
          </span>
        </div>

        {standardGalleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                handleConfirmDelete={handleConfirmDelete}
                isPending={isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01]">
            <p className="text-white/20 text-sm font-medium">No standard galleries available.</p>
          </div>
        )}
      </section>

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
