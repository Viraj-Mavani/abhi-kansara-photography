"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trash2, AlertTriangle, Layers, GripVertical, Pencil } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { deleteService, reorderServices } from "@/app/actions/services";
import type { DetailedService } from "@/lib/api";

// ── dnd-kit ──
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─────────────────────────────────────────────────────────
//  SortableServiceItem — Individual draggable row
// ─────────────────────────────────────────────────────────

interface SortableServiceItemProps {
  service: DetailedService;
  index: number;
  isConfirmingDelete: boolean;
  isDragOverlay?: boolean;
  onDeleteClick: (id: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isPending: boolean;
}

function SortableServiceItem({
  service,
  index,
  isConfirmingDelete,
  isDragOverlay,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
  isPending,
}: SortableServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : "auto",
  } as React.CSSProperties;

  const overlayStyle = isDragOverlay
    ? {
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.3)",
        transform: "scale(1.02)",
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...overlayStyle }}
      className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
        isDragOverlay
          ? "border-[#c9a96e]/50 bg-[#1a1a1a]"
          : isConfirmingDelete
          ? "border-red-500/40 bg-red-500/[0.08]"
          : isDragging
          ? "border-[#c9a96e]/20 bg-white/[0.01]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
      }`}
    >
      {isConfirmingDelete ? (
        /* ── Inline Delete Prompt ── */
        <div className="p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-left-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-200">Delete "{service.title}"?</p>
              <p className="text-[11px] text-red-400/60">This service and all its content will be permanently removed.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={onCancelDelete}
              className="text-white/40 hover:text-white"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={onConfirmDelete}
              isLoading={isPending}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Confirm Delete
            </AdminButton>
          </div>
        </div>
      ) : (
        /* ── View Mode (Draggable Row) ── */
        <div className="flex items-center gap-4 p-4 group">
          {/* Drag Handle */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="touch-none p-1.5 -ml-1 rounded-lg text-white/15 hover:text-[#c9a96e]/70 hover:bg-[#c9a96e]/[0.06] transition-all cursor-grab active:cursor-grabbing flex-shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]/40"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Order Badge */}
          <span className="text-[10px] text-[#c9a96e]/50 bg-[#c9a96e]/[0.06] w-6 h-6 rounded-md font-mono flex-shrink-0 flex items-center justify-center border border-[#c9a96e]/10 font-semibold">
            {index + 1}
          </span>

          {/* Service Icon Container */}
          <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            {service.icon ? (
              <span className="material-symbols-outlined text-[#c9a96e] text-lg">
                {service.icon}
              </span>
            ) : (
              <Layers size={18} className="text-white/20" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-semibold text-white/90 truncate">
                {service.title}
              </p>
              <code className="text-[9px] text-white/35 bg-white/[0.03] px-1.5 py-0.5 rounded font-mono border border-white/5">
                /{service.slug}
              </code>
            </div>
            <p className="text-[11px] text-white/30 truncate mt-0.5">
              {service.tagline}
            </p>
          </div>

          {/* Category */}
          <div className="hidden sm:block text-left flex-shrink-0 w-28">
            <span className="text-xs text-white/50 font-medium">
              {service.category || "General"}
            </span>
          </div>

          {/* Badges / Featured */}
          <div className="flex-shrink-0 w-20 text-center">
            {service.isFeatured ? (
              <span className="inline-flex h-5 items-center px-2 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[9px] font-bold text-[#c9a96e] uppercase tracking-wider">
                Featured
              </span>
            ) : (
              <span className="text-white/10 text-xs">—</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/admin/services/${service.id}`}>
              <button
                className="p-2 text-white/25 hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 rounded-lg transition-all"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Link>
            <button
              onClick={() => onDeleteClick(service.id)}
              className="p-2 text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ServiceListProps {
  initialServices: DetailedService[];
}

export default function ServiceList({ initialServices }: ServiceListProps) {
  const [services, setServices] = useState(() =>
    [...initialServices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );

  useEffect(() => {
    setServices([...initialServices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  }, [initialServices]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── dnd-kit sensors ──
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setError("");

    startTransition(async () => {
      try {
        await deleteService(idToDelete);
        const newServices = services.filter((s) => s.id !== idToDelete);
        setServices(newServices);
        setConfirmDeleteId(null);
        
        // Re-persist order after deletion to close any index gaps
        const ids = newServices.map((s) => s.id);
        if (ids.length > 0) {
          await reorderServices(ids);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete service");
      }
    });
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setConfirmDeleteId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      setServices((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);

        // Fire-and-forget persist to backend
        setIsSaving(true);
        const ids = reordered.map((s) => s.id);
        reorderServices(ids)
          .catch((e) => setError(e instanceof Error ? e.message : "Failed to save order"))
          .finally(() => setIsSaving(false));

        return reordered;
      });
    },
    []
  );

  const activeService = activeId ? services.find((s) => s.id === activeId) : null;

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/30">
          {services.length} service{services.length !== 1 ? "s" : ""} · Drag to reorder
        </p>
        {isSaving && (
          <span className="text-[11px] text-[#c9a96e]/70 animate-pulse flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/60 animate-pulse" />
            Saving order…
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {services.map((service, idx) => (
              <SortableServiceItem
                key={service.id}
                service={service}
                index={idx}
                isConfirmingDelete={confirmDeleteId === service.id}
                onDeleteClick={setConfirmDeleteId}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={() => setConfirmDeleteId(null)}
                isPending={isPending}
              />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay — Renders the premium lifted clone during drag */}
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeService ? (
            <SortableServiceItem
              service={activeService}
              index={services.findIndex((s) => s.id === activeService.id)}
              isConfirmingDelete={false}
              isDragOverlay
              onDeleteClick={() => {}}
              onConfirmDelete={() => {}}
              onCancelDelete={() => {}}
              isPending={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {services.length === 0 && (
        <div className="text-center py-20 bg-white/[0.01] rounded-xl border border-white/[0.06]">
          <p className="text-white/20 text-sm font-medium">No services found.</p>
          <Link href="/admin/services/new" className="mt-4 inline-block">
            <AdminButton variant="ghost" size="sm">Create First Service</AdminButton>
          </Link>
        </div>
      )}
    </div>
  );
}
