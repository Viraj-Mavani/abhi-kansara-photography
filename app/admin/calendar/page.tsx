"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ArrowLeft, Plus, Calendar as CalendarIcon,
  MapPin, Clock, Search, X, CalendarSync, LayoutGrid, CalendarDays,
} from "lucide-react";
import {
  format, addMonths, subMonths, addWeeks, subWeeks,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday, setMonth, setYear,
} from "date-fns";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEventColor } from "@/lib/event-colors";
import {
  getAllBookings, createBookingAction, updateBookingAction, deleteBookingAction,
} from "@/app/actions/bookings";
import BookingModal, { Booking } from "@/components/admin/BookingModal";
import DatePickerOverlay from "@/components/admin/DatePickerOverlay";

// ─── Animation Variants ───
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.015 } },
};
const cellVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthKey, setMonthKey] = useState(0);

  // View mode
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Date Picker
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerFocus, setDatePickerFocus] = useState<"month" | "year">("month");

  // Highlight after search navigation
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  // ─── Data ───
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data as Booking[]);
    } catch (err) { console.error("Failed to load bookings", err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadBookings(); }, [currentDate]);

  // ─── Visible Days ───
  const visibleDays = useMemo(() => {
    if (viewMode === "week") {
      const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
      const we = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: ws, end: we });
    }
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const sd = new Date(start);
    sd.setDate(sd.getDate() - (sd.getDay() === 0 ? 6 : sd.getDay() - 1));
    const ed = new Date(end);
    ed.setDate(ed.getDate() + (7 - (ed.getDay() === 0 ? 7 : ed.getDay())));
    return eachDayOfInterval({ start: sd, end: ed });
  }, [currentDate, viewMode]);

  // ─── Search Results ───
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return bookings.filter((b) =>
      (b.clientName?.toLowerCase().includes(q)) ||
      (b.location?.toLowerCase().includes(q)) ||
      (b.eventType?.toLowerCase().includes(q))
    );
  }, [searchQuery, bookings]);

  // ─── Navigation ───
  const handlePrev = () => {
    if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
    setMonthKey((k) => k - 1);
  };
  const handleNext = () => {
    if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
    setMonthKey((k) => k + 1);
  };
  const handleToday = () => { setCurrentDate(new Date()); setMonthKey(0); };

  const openNewBooking = (date: Date) => {
    setSelectedDate(date); setEditingBooking(null); setIsModalOpen(true);
  };
  const openEditBooking = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation(); setEditingBooking(booking);
    setSelectedDate(new Date(booking.startDateTime)); setIsModalOpen(true);
  };
  const handleSaveBooking = async (b: Booking) => {
    if (b.id) await updateBookingAction(b.id, b); else await createBookingAction(b);
    await loadBookings();
  };
  const handleDeleteBooking = async (id: string) => {
    await deleteBookingAction(id); await loadBookings();
  };

  // ─── Search Navigate ───
  const navigateToBooking = useCallback((booking: Booking) => {
    const d = new Date(booking.startDateTime);
    setCurrentDate(d);
    setSearchQuery(""); setIsSearchOpen(false);
    setHighlightedDate(d.toISOString());
    setTimeout(() => setHighlightedDate(null), 5000);
    setMonthKey((k) => k + 1);
  }, []);

  // ─── Date Picker ───
  const handleDatePickerSelect = (month: number, year: number) => {
    const d = new Date(currentDate);
    d.setFullYear(year); d.setMonth(month);
    setCurrentDate(d); setMonthKey((k) => k + 1);
  };

  // ─── Toggle Search ───
  const toggleSearch = () => {
    if (isSearchOpen) { setSearchQuery(""); setIsSearchOpen(false); }
    else { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }
  };

  // ─── Booking Chip renderer ───
  const renderChip = (booking: Booking, size: "sm" | "lg" = "sm") => {
    const ec = getEventColor(booking.eventType);
    return (
      <motion.div
        key={booking.id}
        layout
        onClick={(e) => openEditBooking(booking, e)}
        className={cn(
          "rounded-md font-medium border-l-2 border transition-all hover:brightness-125 hover:scale-[1.02] active:scale-100 cursor-pointer",
          size === "sm" ? "px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs" : "px-3 py-2 text-xs sm:text-sm"
        )}
        style={{
          backgroundColor: ec.bg,
          borderColor: ec.border,
          borderLeftColor: ec.color,
          color: ec.color,
        }}
      >
        <div className="flex items-center gap-1 truncate">
          {!booking.isFullDay && <Clock className="w-2.5 h-2.5 shrink-0 opacity-60" />}
          <span className="truncate font-semibold">{booking.clientName || booking.status}</span>
        </div>
        {booking.location && (
          <div className="flex items-center gap-1 mt-0.5 opacity-55 text-[9px] sm:text-[10px] truncate" style={{ color: ec.color }}>
            <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" />
            <span className="truncate">{booking.location}</span>
          </div>
        )}
      </motion.div>
    );
  };

  const showSearchResults = isSearchOpen && searchQuery.trim().length > 0;

  return (
    <div className="h-screen bg-[#07070a] flex flex-col font-sans text-white/90 selection:bg-[#c9a96e]/30 overflow-hidden">

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="shrink-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-5 sm:px-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 -ml-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">Admin</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#c9a96e]" /> Scheduling Hub
          </h1>
        </div>
        <button onClick={() => openNewBooking(new Date())} className="flex items-center gap-2 bg-[#c9a96e] hover:bg-[#d4b881] text-[#07070a] px-3 sm:px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(201,169,110,0.2)] transition-all hover:shadow-[0_0_28px_rgba(201,169,110,0.35)] active:scale-95">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Booking</span>
        </button>
      </motion.header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 pb-3 sm:pt-6 sm:pb-4 gap-3 overflow-hidden">

        {/* ── Controls Bar ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
          className="shrink-0 flex flex-wrap justify-between sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-y-3 sm:gap-3"
        >
          {/* Left controls */}
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:justify-start relative min-w-0">
            {/* Today */}
            <button onClick={handleToday} className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all shrink-0">
              <CalendarSync className="w-3.5 h-3.5 sm:hidden" />
              <span className="hidden sm:inline">Today</span>
            </button>

            {/* View Toggle */}
            <button onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/15 transition-all shrink-0"
            >
              {viewMode === "month" ? <LayoutGrid className="w-3.5 h-3.5" /> : <CalendarDays className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{viewMode === "month" ? "Month" : "Week"}</span>
            </button>

            {/* Search toggle */}
            <button onClick={toggleSearch}
              className={cn("p-2 rounded-lg border transition-all shrink-0", isSearchOpen ? "border-[#c9a96e]/30 bg-[#c9a96e]/10 text-[#c9a96e]" : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06]")}
            >
              {isSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
            </button>

            {/* Expandable search input */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden absolute left-full ml-2 sm:relative sm:left-auto sm:ml-0 z-50 shrink-0"
                >
                  <input ref={searchInputRef} type="text" placeholder="Search clients, locations..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && toggleSearch()}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!searchQuery.trim()) setIsSearchOpen(false);
                      }, 200);
                    }}
                    className="w-[180px] sm:w-[220px] bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                    style={{ colorScheme: "dark" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Nav arrows */}
          <div className="flex items-center justify-end order-2 sm:order-3">
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
              <button onClick={handlePrev} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90" aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNext} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90" aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Clickable Month + Year */}
          <div className="w-full sm:w-auto sm:col-span-1 flex justify-center text-center order-3 sm:order-2">
            <AnimatePresence mode="wait">
              <motion.h2 key={format(currentDate, "yyyy-MM")} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} className="text-lg sm:text-xl tabular-nums select-none whitespace-nowrap"
              >
                <span onClick={() => { setDatePickerFocus("month"); setIsDatePickerOpen(true); }}
                  className="font-extrabold tracking-tight text-white/95 cursor-pointer hover:text-[#c9a96e] transition-colors"
                >
                  {format(currentDate, "MMMM")}
                </span>
                <span onClick={() => { setDatePickerFocus("year"); setIsDatePickerOpen(true); }}
                  className="font-light text-white/35 ml-2 text-base sm:text-lg cursor-pointer hover:text-[#c9a96e] transition-colors"
                >
                  {format(currentDate, "yyyy")}
                </span>
              </motion.h2>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Main Calendar / Search Results Area ── */}
        <AnimatePresence mode="wait">
          {showSearchResults ? (
            /* ── Search Results Panel ── */
            <motion.div key="search-results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
            >
              <div className="mb-3 text-sm text-white/40">
                <span className="text-[#c9a96e] font-semibold">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} found
              </div>
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <Search className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">No bookings match your search</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.map((b) => {
                    const ec = getEventColor(b.eventType);
                    return (
                      <motion.div key={b.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => navigateToBooking(b)}
                        className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 cursor-pointer hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-sm text-white/90">{b.clientName || "Untitled"}</h4>
                            {b.location && (
                              <div className="flex items-center gap-1 mt-0.5 text-white/40 text-xs">
                                <MapPin className="w-3 h-3" /><span className="truncate">{b.location}</span>
                              </div>
                            )}
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ color: ec.color, backgroundColor: ec.bg, borderColor: ec.border }}>
                            {b.eventType || "Other"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40 mt-2">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(new Date(b.startDateTime), "MMM d, yyyy")}
                          </div>
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium",
                            b.status === "Confirmed" ? "bg-green-500/10 text-green-400" : b.status === "Blocked" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-white/50"
                          )}>{b.status}</span>
                        </div>
                        <div className="text-[10px] text-[#c9a96e]/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to navigate →</div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : viewMode === "week" ? (
            /* ── Week View ── */
            <motion.div key="week-view" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex-1 min-h-0 bg-[#0a0a0f] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/60"
            >
              {/* PC: 7-column, Mobile: vertical stack */}
              <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-7 overflow-y-auto sm:overflow-hidden no-scrollbar">
                {visibleDays.map((day) => {
                  const dayBookings = bookings.filter((b) => isSameDay(new Date(b.startDateTime), day));
                  const todayDay = isToday(day);
                  const isHighlighted = highlightedDate && isSameDay(day, new Date(highlightedDate));
                  return (
                    <motion.div key={day.toISOString()} initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}
                      onClick={() => openNewBooking(day)}
                      className={cn(
                        "border-b sm:border-b-0 sm:border-r border-white/[0.06] p-3 sm:p-2 flex flex-col cursor-pointer hover:bg-white/[0.02] transition-colors group sm:overflow-y-auto sm:min-h-0 no-scrollbar relative",
                        todayDay && "bg-[#c9a96e]/[0.04] sm:border-t-2 sm:border-t-[#c9a96e]",
                        todayDay && "border-l-2 sm:border-l-0 border-l-[#c9a96e]",
                        isHighlighted && "ring-2 ring-inset ring-[#c9a96e] bg-[#c9a96e]/5 z-10"
                      )}
                      animate={isHighlighted ? { opacity: 1, y: 0, backgroundColor: ["#c9a96e1a", "#c9a96e00", "#c9a96e1a", "#c9a96e00", "#c9a96e1a"] } : { opacity: 1, y: 0 }}
                    >
                      {/* Day label */}
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", todayDay ? "text-[#c9a96e]" : "text-white/30")}>
                          {format(day, "EEE")}
                        </span>
                        <span className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold",
                          todayDay ? "bg-[#c9a96e] text-[#07070a] shadow-[0_0_12px_rgba(201,169,110,0.4)]" : "text-white/60"
                        )}>
                          {format(day, "d")}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[#c9a96e] opacity-0 group-hover:opacity-70 transition-opacity ml-auto" />
                      </div>
                      {/* Booking cards */}
                      <div className="space-y-1.5 flex-1">
                        {dayBookings.length === 0 && (
                          <p className="text-[10px] text-white/15 italic">No bookings</p>
                        )}
                        {dayBookings.map((b) => renderChip(b, "lg"))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ── Month View ── */
            <motion.div key="month-view" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex-1 min-h-0 bg-[#0a0a0f] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/60"
            >
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-white/[0.06] bg-white/[0.015] shrink-0">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                  <div key={d} className="py-2.5 text-center text-[10px] sm:text-xs font-bold text-white/30 tracking-widest uppercase">{d}</div>
                ))}
              </div>

              {/* Grid */}
              <motion.div key={monthKey} variants={containerVariants} initial="hidden" animate="visible"
                className="flex-1 min-h-0 grid grid-cols-7 auto-rows-fr overflow-hidden"
              >
                {visibleDays.map((day) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const dayBookings = bookings.filter((b) => isSameDay(new Date(b.startDateTime), day));
                  const todayDay = isToday(day);
                  const isHighlighted = highlightedDate && isSameDay(day, new Date(highlightedDate));
                  return (
                    <motion.div key={day.toISOString()} variants={cellVariants} onClick={() => openNewBooking(day)}
                      className={cn(
                        "border-b border-r border-white/[0.04] p-1.5 sm:p-2 relative group cursor-pointer transition-colors duration-150",
                        !isCurrentMonth && "bg-[#07070a]/40",
                        isCurrentMonth && "hover:bg-white/[0.025]",
                        todayDay && "bg-[#c9a96e]/[0.04]",
                        isHighlighted && "ring-2 ring-inset ring-[#c9a96e] bg-[#c9a96e]/5 z-10"
                      )}
                      animate={isHighlighted ? { backgroundColor: ["#c9a96e1a", "#c9a96e00", "#c9a96e1a", "#c9a96e00", "#c9a96e1a"] } : {}}
                    >
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] sm:text-xs font-semibold transition-all",
                          todayDay ? "bg-[#c9a96e] text-[#07070a] shadow-[0_0_12px_rgba(201,169,110,0.4)]" : isCurrentMonth ? "text-white/65 group-hover:text-white/90" : "text-white/15"
                        )}>
                          {format(day, "d")}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[#c9a96e] opacity-0 group-hover:opacity-70 transition-opacity hidden sm:block" />
                      </div>
                      <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[72px] no-scrollbar">
                        {dayBookings.map((b) => renderChip(b))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Overlays ── */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveBooking} onDelete={handleDeleteBooking}
        selectedDate={selectedDate} existingBookings={bookings} editingBooking={editingBooking} />
      <DatePickerOverlay isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} currentDate={currentDate}
        onSelect={handleDatePickerSelect} initialFocus={datePickerFocus} />
    </div>
  );
}
