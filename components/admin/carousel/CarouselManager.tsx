"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from "@/app/actions/carousel";
import type { CarouselItem } from "@/lib/api";
import { Trash2, Pencil, Plus, X, Check, GripVertical, AlertTriangle } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  CarouselManager — Inline-editable sortable list
//  Implements "Replace Row" deletion UX.
// ─────────────────────────────────────────────────────────

interface CarouselManagerProps {
  items: CarouselItem[];
}

export default function CarouselManager({ items: initialItems }: CarouselManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  // Sync state with props when server data refreshes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // Inline confirmation — replaces the row entirely
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startEdit = (item: CarouselItem) => {
    setConfirmDeleteId(null);
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditImageUrl(item.imageUrl);
    setEditSortOrder(item.sortOrder);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    setError("");
    startTransition(async () => {
      try {
        await updateCarouselItem(id, {
          id,
          title: editTitle,
          imageUrl: editImageUrl,
          sortOrder: editSortOrder,
        });
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, title: editTitle, imageUrl: editImageUrl, sortOrder: editSortOrder }
              : item
          )
        );
        setEditingId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update");
      }
    });
  };

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
        setItems((prev) => prev.filter((item) => item.id !== idToDelete));
        setConfirmDeleteId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete carousel item");
      }
    });
  };

  const handleAdd = () => {
    if (!newTitle || !newImageUrl) return;
    setError("");
    startTransition(async () => {
      try {
        await createCarouselItem({
          title: newTitle,
          imageUrl: newImageUrl,
          sortOrder: newSortOrder,
        });
        setShowAdd(false);
        setNewTitle("");
        setNewImageUrl("");
        setNewSortOrder(items.length);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create");
      }
    });
  };

  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Item List */}
      <div className="space-y-2">
        {sortedItems.map((item) => {
          const isEditing = editingId === item.id;
          const isConfirmingDelete = confirmDeleteId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                isConfirmingDelete
                  ? "border-red-500/40 bg-red-500/[0.08]"
                  : isEditing
                  ? "border-[#c9a96e]/40 bg-[#c9a96e]/[0.02]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {isConfirmingDelete ? (
                /* ── Inline Delete Prompt (Replaces Row) ── */
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
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-white/40 hover:text-white"
                    >
                      Cancel
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={confirmDelete}
                      isLoading={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Confirm
                    </AdminButton>
                  </div>
                </div>
              ) : isEditing ? (
                /* ── Edit Mode ── */
                <div className="p-4 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="grid grid-cols-3 gap-3">
                    <AdminInput
                      label="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <AdminInput
                      label="Image URL"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                    />
                    <AdminInput
                      label="Sort Order"
                      type="number"
                      value={editSortOrder}
                      onChange={(e) => setEditSortOrder(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <AdminButton variant="ghost" size="sm" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" /> Cancel
                    </AdminButton>
                    <AdminButton size="sm" onClick={() => saveEdit(item.id)} isLoading={isPending}>
                      <Check className="h-3.5 w-3.5" /> Save
                    </AdminButton>
                  </div>
                </div>
              ) : (
                /* ── View Mode ── */
                <div className="flex items-center gap-4 p-3 group">
                  <GripVertical className="h-4 w-4 text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0" />

                  {/* Thumbnail */}
                  <div className="relative h-12 w-20 rounded-md overflow-hidden flex-shrink-0 bg-white/[0.04] ring-1 ring-white/10">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-white/30 truncate mt-0.5">
                      {item.imageUrl}
                    </p>
                  </div>

                  {/* Sort Order Badge */}
                  <span className="text-[10px] text-white/30 bg-white/[0.04] px-2 py-1 rounded font-mono flex-shrink-0 border border-white/[0.06]">
                    ORDER: {String(item.sortOrder).padStart(2, "0")}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 text-white/20 hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
            <button onClick={() => setShowAdd(false)} className="text-white/20 hover:text-white"><X size={16}/></button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label="Title" placeholder="Wedding" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <AdminInput label="Image URL" placeholder="https://..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
            <AdminInput label="Sort Order" type="number" value={newSortOrder} onChange={(e) => setNewSortOrder(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2 justify-end pt-2">
            <AdminButton variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</AdminButton>
            <AdminButton size="sm" onClick={handleAdd} isLoading={isPending}>Create Item</AdminButton>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => { setShowAdd(true); setNewSortOrder(items.length); }}
          className="w-full py-4 border-2 border-dashed border-white/[0.06] rounded-xl text-white/20 text-sm font-medium hover:border-[#c9a96e]/40 hover:text-[#c9a96e]/60 hover:bg-[#c9a96e]/[0.02] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Carousel Item
        </button>
      )}
    </div>
  );
}
