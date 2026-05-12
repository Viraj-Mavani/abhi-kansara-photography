"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Image as ImageIcon, X, ArrowRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSmugMugAlbums } from "@/app/actions/galleries";
import { useOverlay } from "@/hooks/useOverlay";

interface SmugMugAlbum {
  albumId: string;
  albumKey: string;
  title: string;
  description: string;
  imageCount: number;
  lastUpdated: string;
}

interface AlbumPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (album: SmugMugAlbum) => void;
}

export default function AlbumPicker({ isOpen, onClose, onSelect }: AlbumPickerProps) {
  const [albums, setAlbums] = useState<SmugMugAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Unified Overlay logic (Scroll Lock, Esc Key, Back Button)
  useOverlay(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      loadAlbums();
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  async function loadAlbums() {
    setLoading(true);
    try {
      const data = await getSmugMugAlbums();
      setAlbums(data);
    } catch (e) {
      console.error("Failed to load albums", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[80vh] flex flex-col bg-[#08080a] border border-white/5 rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.03] bg-linear-to-b from-white/[0.02] to-transparent">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 relative group">
                  <div className="absolute inset-0 bg-amber-500/10 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                  <ImageIcon className="h-4 w-4 text-amber-500 relative z-10" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white tracking-tight">SmugMug Library</h2>
                  <p className="text-[9px] text-amber-500/40 uppercase tracking-[0.2em] mt-0.5 font-bold">Synchronize Collections</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-white/[0.01]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/10 group-focus-within:text-amber-500/40 transition-colors" />
                <input
                  type="text"
                  placeholder="Find your collection..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl pl-11 pr-5 py-3 text-xs text-white/80 outline-none focus:border-amber-500/20 focus:bg-white/[0.02] transition-all placeholder:text-white/5"
                />
              </div>
            </div>

            {/* Content Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 pb-6 space-y-2 overscroll-contain"
              style={{ scrollbarWidth: "none" }}
              data-lenis-prevent="true"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 rounded-full border border-amber-500/5 border-t-amber-500/60" 
                    />
                    <RefreshCw className="h-3 w-3 absolute inset-0 m-auto text-amber-500/20 animate-pulse" />
                  </div>
                  <span className="text-[9px] text-amber-500/30 uppercase tracking-[0.3em] font-bold">Authenticating API</span>
                </div>
              ) : filteredAlbums.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {filteredAlbums.map((album) => (
                    <button
                      key={album.albumKey}
                      type="button"
                      onClick={() => onSelect(album)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-amber-500/[0.02] hover:border-amber-500/20 transition-all text-left group relative overflow-hidden"
                    >
                      {/* Selection Glow */}
                      <div className="absolute inset-0 bg-linear-to-r from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Icon Container */}
                      <div className="h-11 w-11 rounded-lg bg-white/[0.02] flex items-center justify-center flex-shrink-0 border border-white/[0.05] group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all">
                        <ImageIcon className="h-5 w-5 text-white/5 group-hover:text-amber-500/60 transition-colors" />
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                          {album.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{album.imageCount}</span>
                            <span className="text-[8px] text-white/10 uppercase tracking-widest">Photos</span>
                          </div>
                          <div className="h-2 w-[1px] bg-white/[0.05]" />
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">
                              {new Date(album.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pr-1">
                        <span className="text-[9px] text-amber-500/80 font-bold uppercase tracking-widest">Link</span>
                        <ArrowRight className="h-3 w-3 text-amber-500" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Search className="h-5 w-5 text-white/5 mb-4" />
                  <h4 className="text-white/40 text-xs font-medium tracking-tight">
                    {search ? "No results found" : "No albums found"}
                  </h4>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-white/[0.03] flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold">
                  API Connected
                </span>
              </div>
              <p className="text-[8px] text-white/10 uppercase tracking-[0.1em] font-medium">
                Infrastructure v2.1
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
