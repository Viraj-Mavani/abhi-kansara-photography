"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Timer, Save, AlertTriangle, X } from "lucide-react";
import { createHeroBackground, deleteHeroBackground, updateHomeConfig } from "@/app/actions/hero";
import { PageConfig } from "@/lib/api";
import AdminButton from "@/components/admin/ui/AdminButton";

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

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
    setError(null);
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
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
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
              value={heroInterval}
              onChange={(e) => setHeroInterval(parseFloat(e.target.value))}
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
          <p className="text-sm text-white/40">Manage the full-screen visuals for your landing page.</p>
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backgrounds.map((bg) => {
            const isConfirming = confirmDeleteId === bg.id;

            return (
              <div 
                key={bg.id} 
                className={`group relative aspect-[16/9] rounded-lg overflow-hidden border transition-all duration-300 ${
                  isConfirming ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-black/40"
                }`}
              >
                {isConfirming ? (
                  /* ── Inline Confirmation Overlay ── */
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-sm font-bold text-white mb-1">Delete Background?</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Action cannot be undone</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
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
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <button
                      onClick={() => handleDeleteClick(bg.id)}
                      className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/60 backdrop-blur-md text-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40 truncate max-w-[80%] uppercase tracking-tighter">
                      {bg.imageUrl}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {backgrounds.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-white/20 italic">No background images configured.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
