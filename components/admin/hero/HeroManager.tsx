"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Timer, Save, AlertTriangle, X, GripVertical } from "lucide-react";
import { 
  createHeroBackground, 
  deleteHeroBackground, 
  updateHomeConfig,
  reorderHeroBackgrounds 
} from "@/app/actions/hero";
import { PageConfig } from "@/lib/api";
import AdminButton from "@/components/admin/ui/AdminButton";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HeroBackground {
  id: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

interface HeroManagerProps {
  initialBackgrounds: HeroBackground[];
  homeConfig: PageConfig;
}

// ── Sortable Item Component ──
function SortableBackground({ 
  bg, 
  isConfirming, 
  isPending, 
  onDeleteClick, 
  onConfirmDelete, 
  onCancelDelete 
}: { 
  bg: HeroBackground;
  isConfirming: boolean;
  isPending: boolean;
  onDeleteClick: (id: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-[16/9] rounded-lg overflow-hidden border transition-all duration-300 ${
        isConfirming ? "border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/10" : "border-white/10 bg-black/40"
      } ${isDragging ? "shadow-2xl ring-2 ring-[#c9a96e]/50" : ""}`}
    >
      {isConfirming ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-bold text-white mb-1">Delete Background?</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Action cannot be undone</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancelDelete}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              disabled={isPending}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Confirm"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <img 
            src={bg.imageUrl} 
            alt={bg.altText || "Background"} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className="absolute top-3 left-3 h-8 w-8 rounded-lg bg-black/60 backdrop-blur-md text-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-[#c9a96e] cursor-grab active:cursor-grabbing transition-all duration-200 border border-white/5"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <button
            onClick={() => onDeleteClick(bg.id)}
            className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/60 backdrop-blur-md text-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 border border-white/5"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/60 truncate max-w-[80%] font-mono">
            {String(bg.order).padStart(2, '0')} | {bg.imageUrl.split('/').pop()}
          </div>
        </>
      )}
    </div>
  );
}

export default function HeroManager({ initialBackgrounds, homeConfig }: HeroManagerProps) {
  const router = useRouter();
  const [backgrounds, setBackgrounds] = useState<HeroBackground[]>(initialBackgrounds);
  const [heroInterval, setHeroInterval] = useState<number>(homeConfig.heroInterval ?? 4);
  const [newImageUrl, setNewImageUrl] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync state if props change
  useEffect(() => {
    setBackgrounds(initialBackgrounds);
    setHeroInterval(homeConfig.heroInterval ?? 4);
  }, [initialBackgrounds, homeConfig]);

  // DND Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log(`Dragging ${active.id} over ${over.id}`);

    const oldIndex = backgrounds.findIndex((item) => item.id === active.id);
    const newIndex = backgrounds.findIndex((item) => item.id === over.id);

    const newBackgrounds = arrayMove(backgrounds, oldIndex, newIndex).map((item, index) => ({
      ...item,
      order: index
    }));

    console.log("New Backgrounds Order:", newBackgrounds.map(b => `${b.imageUrl} -> ${b.order}`));

    // Optimistic UI Update
    setBackgrounds(newBackgrounds);

    // Sync to backend
    startTransition(async () => {
      try {
        const ids = newBackgrounds.map(b => b.id);
        console.log("Syncing reorder to backend:", ids);
        await reorderHeroBackgrounds(ids);
      } catch (err: unknown) {
        console.error("Reorder failed:", err);
        setError("Failed to save new order. Changes reverted.");
        setBackgrounds(initialBackgrounds);
      }
    });
  };

  const handleAddBackground = async () => {
    if (!newImageUrl.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await createHeroBackground({
          imageUrl: newImageUrl.trim(),
          order: backgrounds.length,
          altText: "Hero Background",
        });
        setNewImageUrl("");
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to add background");
      }
    });
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setError(null);

    startTransition(async () => {
      try {
        await deleteHeroBackground(idToDelete);
        setConfirmDeleteId(null);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to delete background");
        setConfirmDeleteId(null);
      }
    });
  };

  const handleUpdateInterval = async () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateHomeConfig(homeConfig.id, {
          ...homeConfig,
          heroInterval,
        });
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to update pacing");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500 pb-20">
      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">Action Failed</p>
            <p className="text-xs text-red-500/70 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-white/20 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Cinematic Pacing ── */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e]">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white/90">Cinematic Pacing</h2>
            <p className="text-sm text-white/40">Adjust the timing frequency (in seconds) for landing transitions.</p>
          </div>
        </div>

        <div className="flex items-end gap-4 max-w-sm">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">
              Interval (Seconds)
            </label>
            <input
              type="number"
              min={2}
              max={20}
              step={0.5}
              value={heroInterval === 0 ? "" : heroInterval}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeroInterval(isNaN(val) ? 0 : val);
              }}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
            />
          </div>
          <AdminButton
            onClick={handleUpdateInterval}
            isLoading={isPending}
            className="h-[42px] px-6 rounded-lg font-semibold text-sm transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            Update Pacing
          </AdminButton>
        </div>
      </section>

      {/* ── Background Image Grid ── */}
      <section className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white/90">Background Images</h2>
          <p className="text-sm text-white/40">Drag the handles to reorder the sequence. Changes save automatically.</p>
        </div>

        {/* Add New */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter Image URL (R2/S3)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#c9a96e]/50 transition-colors"
            />
          </div>
          <AdminButton
            onClick={handleAddBackground}
            disabled={!newImageUrl.trim()}
            isLoading={isPending}
            variant="ghost"
            className="px-6 rounded-lg text-[#c9a96e] border border-[#c9a96e]/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Background
          </AdminButton>
        </div>

        {/* Sortable Grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={backgrounds.map(b => b.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backgrounds.map((bg) => (
                <SortableBackground
                  key={bg.id}
                  bg={bg}
                  isConfirming={confirmDeleteId === bg.id}
                  isPending={isPending}
                  onDeleteClick={setConfirmDeleteId}
                  onConfirmDelete={confirmDelete}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                />
              ))}

              {backgrounds.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-xl">
                  <p className="text-white/20 italic">No background images configured.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
