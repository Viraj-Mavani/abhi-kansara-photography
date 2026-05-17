"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  reorderCarouselItems,
} from "@/app/actions/carousel";
import type { CarouselItem } from "@/lib/api";
import {
  Trash2,
  Pencil,
  Plus,
  X,
  Check,
  GripVertical,
  AlertTriangle,
} from "lucide-react";

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
//  SortableItem — Individual draggable row
// ─────────────────────────────────────────────────────────

interface SortableItemProps {
  item: CarouselItem;
  index: number;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  isDragOverlay?: boolean;
  // callbacks
  onStartEdit: (item: CarouselItem) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  // edit state
  editTitle: string;
  editImageUrl: string;
  onEditTitleChange: (v: string) => void;
  onEditImageUrlChange: (v: string) => void;
  isPending: boolean;
}

function SortableItem({
  item,
  index,
  isEditing,
  isConfirmingDelete,
  isDragOverlay,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteClick,
  onConfirmDelete,
  onCancelDelete,
  editTitle,
  editImageUrl,
  onEditTitleChange,
  onEditImageUrlChange,
  isPending,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : "auto",
  } as React.CSSProperties;

  // Overlay clone gets a lifted visual
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
          : isEditing
          ? "border-[#c9a96e]/40 bg-[#c9a96e]/[0.02]"
          : isDragging
          ? "border-[#c9a96e]/20 bg-white/[0.01]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
      }`}
    >
      {isConfirmingDelete ? (
        /* ── Inline Delete Prompt ── */
        <div className="p-3 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-left-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-200">Delete this item?</p>
              <p className="text-[11px] text-red-400/70">Action cannot be undone.</p>
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
              <Trash2 className="h-3.5 w-3.5" /> Confirm
            </AdminButton>
          </div>
        </div>
      ) : isEditing ? (
        /* ── Edit Mode ── */
        <div className="p-4 space-y-3 animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Title"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
            />
            <AdminInput
              label="Image URL"
              value={editImageUrl}
              onChange={(e) => onEditImageUrlChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <AdminButton variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="h-3.5 w-3.5" /> Cancel
            </AdminButton>
            <AdminButton size="sm" onClick={() => onSaveEdit(item.id)} isLoading={isPending}>
              <Check className="h-3.5 w-3.5" /> Save
            </AdminButton>
          </div>
        </div>
      ) : (
        /* ── View Mode (Draggable) ── */
        <div className="flex items-center gap-3 p-3 group">
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

          {/* Thumbnail */}
          <div className="relative h-11 w-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] ring-1 ring-white/10">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="72px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/80 truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-white/25 truncate mt-0.5">
              {item.imageUrl}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onStartEdit(item)}
              className="p-2 text-white/25 hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 rounded-lg transition-all"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDeleteClick(item.id)}
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

// ─────────────────────────────────────────────────────────
//  CarouselManager — Drag & Drop sortable list
// ─────────────────────────────────────────────────────────

interface CarouselManagerProps {
  items: CarouselItem[];
}

export default function CarouselManager({ items: initialItems }: CarouselManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(() =>
    [...initialItems].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  useEffect(() => {
    setItems([...initialItems].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [initialItems]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

  // ── Edit handlers ──
  const startEdit = (item: CarouselItem) => {
    setConfirmDeleteId(null);
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditImageUrl(item.imageUrl);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    setError("");
    startTransition(async () => {
      try {
        await updateCarouselItem(id, {
          id,
          title: editTitle,
          imageUrl: editImageUrl,
          sortOrder: items.findIndex((i) => i.id === id),
        });
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, title: editTitle, imageUrl: editImageUrl }
              : item
          )
        );
        setEditingId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update");
      }
    });
  };

  // ── Delete handlers ──
  const handleDeleteClick = (id: string) => {
    setEditingId(null);
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setError("");
    startTransition(async () => {
      try {
        await deleteCarouselItem(idToDelete);
        const newItems = items.filter((item) => item.id !== idToDelete);
        setItems(newItems);
        setConfirmDeleteId(null);
        // Re-persist the order after deletion
        const ids = newItems.map((i) => i.id);
        if (ids.length > 0) {
          await reorderCarouselItems(ids);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete carousel item");
      }
    });
  };

  // ── Add handler ──
  const handleAdd = () => {
    if (!newTitle || !newImageUrl) return;
    setError("");
    startTransition(async () => {
      try {
        await createCarouselItem({
          title: newTitle,
          imageUrl: newImageUrl,
          sortOrder: items.length,
        });
        setShowAdd(false);
        setNewTitle("");
        setNewImageUrl("");
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create");
      }
    });
  };

  // ── Drag handlers ──
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setEditingId(null);
    setConfirmDeleteId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);

        // Fire-and-forget persist to backend
        setIsSaving(true);
        const ids = reordered.map((i) => i.id);
        reorderCarouselItems(ids)
          .catch((e) => setError(e instanceof Error ? e.message : "Failed to save order"))
          .finally(() => setIsSaving(false));

        return reordered;
      });
    },
    []
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/30">
          {items.length} item{items.length !== 1 ? "s" : ""} · Drag to reorder
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
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {items.map((item, idx) => (
              <SortableItem
                key={item.id}
                item={item}
                index={idx}
                isEditing={editingId === item.id}
                isConfirmingDelete={confirmDeleteId === item.id}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onDeleteClick={handleDeleteClick}
                onConfirmDelete={confirmDelete}
                onCancelDelete={() => setConfirmDeleteId(null)}
                editTitle={editTitle}
                editImageUrl={editImageUrl}
                onEditTitleChange={setEditTitle}
                onEditImageUrlChange={setEditImageUrl}
                isPending={isPending}
              />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay — renders the lifted clone */}
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeItem ? (
            <SortableItem
              item={activeItem}
              index={items.findIndex((i) => i.id === activeItem.id)}
              isEditing={false}
              isConfirmingDelete={false}
              isDragOverlay
              onStartEdit={() => {}}
              onCancelEdit={() => {}}
              onSaveEdit={() => {}}
              onDeleteClick={() => {}}
              onConfirmDelete={() => {}}
              onCancelDelete={() => {}}
              editTitle=""
              editImageUrl=""
              onEditTitleChange={() => {}}
              onEditImageUrlChange={() => {}}
              isPending={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-12 text-white/20 text-sm rounded-xl border border-white/[0.06]">
          No carousel items yet.
        </div>
      )}

      {/* Add New */}
      {showAdd ? (
        <div className="rounded-xl border border-[#c9a96e]/20 bg-[#c9a96e]/[0.03] p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a96e]">
              New Carousel Item
            </h3>
            <button onClick={() => setShowAdd(false)} className="text-white/20 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Title"
              placeholder="Wedding"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <AdminInput
              label="Image URL"
              placeholder="https://..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 justify-end pt-2">
            <AdminButton variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
              Cancel
            </AdminButton>
            <AdminButton size="sm" onClick={handleAdd} isLoading={isPending}>
              Create Item
            </AdminButton>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-4 border-2 border-dashed border-white/[0.06] rounded-xl text-white/20 text-sm font-medium hover:border-[#c9a96e]/40 hover:text-[#c9a96e]/60 hover:bg-[#c9a96e]/[0.02] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Carousel Item
        </button>
      )}
    </div>
  );
}
