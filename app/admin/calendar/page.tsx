"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Search,
  CalendarSync,
  LayoutGrid,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getAllBookings,
  createBookingAction,
  updateBookingAction,
  deleteBookingAction,
} from "@/app/actions/bookings";
import BookingModal, { Booking } from "@/components/admin/BookingModal";

// ─────────────────────────────────────────────────────────
//  Typography Options (for month/year heading):
//
//  Option A (Current — Contrast weight): Month in bold serif/display,
//  Year in thin sans. E.g. "Playfair Display" bold + "Inter" thin.
//  Visual: "May" large gold-tinted bold, "2026" ghost-white thin.
//
//  Option B (Monospace Year): Month in wide tracking sans,
//  Year in tabular mono. E.g. "Inter" + "JetBrains Mono".
//  Visual: uppercase spaced month, numeric mono year.
//
//  Option C (Split size): Month at 3xl, Year at xl side-by-side
//  both in Inter at different weights. Clean & minimal.
//  (Current implementation uses Option A by default)
// ─────────────────────────────────────────────────────────

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
  const [monthKey, setMonthKey] = useState(0); // triggers re-animation on month change

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Fetch Bookings
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data as Booking[]);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [currentDate]);

  // Calendar Grid Data
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startDate = new Date(start);
    startDate.setDate(
      startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)
    );
    const endDate = new Date(end);
    endDate.setDate(
      endDate.getDate() + (7 - (endDate.getDay() === 0 ? 7 : endDate.getDay()))
    );
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Actions
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setMonthKey((k) => k - 1);
  };
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setMonthKey((k) => k + 1);
  };
  const handleToday = () => {
    setCurrentDate(new Date());
    setMonthKey(0);
  };

  const openNewBooking = (date: Date) => {
    setSelectedDate(date);
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const openEditBooking = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBooking(booking);
    setSelectedDate(new Date(booking.startDateTime));
    setIsModalOpen(true);
  };

  const handleSaveBooking = async (bookingData: Booking) => {
    if (bookingData.id) {
      await updateBookingAction(bookingData.id, bookingData);
    } else {
      await createBookingAction(bookingData);
    }
    await loadBookings();
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteBookingAction(id);
    await loadBookings();
  };

  return (
    <div className="h-screen bg-[#07070a] flex flex-col font-sans text-white/90 selection:bg-[#c9a96e]/30 overflow-hidden">

      {/* ── Top Navigation ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="shrink-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-5 sm:px-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 -ml-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">Admin</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#c9a96e]" />
            Scheduling Hub
          </h1>
        </div>

        <button
          onClick={() => openNewBooking(new Date())}
          className="flex items-center gap-2 bg-[#c9a96e] hover:bg-[#d4b881] text-[#07070a] px-3 sm:px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(201,169,110,0.2)] transition-all hover:shadow-[0_0_28px_rgba(201,169,110,0.35)] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </motion.header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-6 pb-3 sm:pt-8 sm:b-4 gap-3 overflow-hidden">

        {/* ── Controls Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
          className="shrink-0 grid grid-cols-2 sm:grid-cols-3 items-center gap-y-4 sm:gap-3"
        >
          {/* 1. Left: Today + future controls — Order 1 on PC & Mobile */}
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:justify-start">
            {/* Today Button */}
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
            >
              <CalendarSync className="w-3.5 h-3.5 sm:hidden" />
              <span className="hidden sm:inline">Today</span>
            </button>

            {/* Layout Picker — Disabled (Coming Soon) */}
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/[0.06] bg-white/[0.01] text-white/25 cursor-not-allowed transition-all"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Month</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {/* Coming Soon Tooltip */}
              <div className="absolute left-0 top-full mt-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-[#c9a96e]">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">Coming Soon</span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">Week view in next update</p>
                </div>
              </div>
            </div>

            {/* Search — Disabled (Coming Soon) */}
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-1.5 p-2 rounded-lg border border-white/[0.06] bg-white/[0.01] text-white/25 cursor-not-allowed transition-all"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <div className="absolute left-0 top-full mt-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-[#c9a96e]">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">Coming Soon</span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">Client search in next update</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Right: Prev / Next arrows — Order 2 on mobile, 3 on PC */}
          <div className="flex items-center justify-end order-2 sm:order-3">
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. Center: Month + Year Heading — Order 3 on mobile, 2 on PC */}
          <div className="col-span-2 sm:col-span-1 flex justify-center text-center order-3 sm:order-2">
            <AnimatePresence mode="wait">
              <motion.h2
                key={format(currentDate, "yyyy-MM")}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="text-lg sm:text-xl tabular-nums select-none whitespace-nowrap"
              >
                {/* Month: heavier weight, slight gold tint */}
                <span className="font-extrabold tracking-tight text-white/95">
                  {format(currentDate, "MMMM")}
                </span>
                {/* Year: thin, muted */}
                <span className="font-light text-white/35 ml-2 text-base sm:text-lg">
                  {format(currentDate, "yyyy")}
                </span>
              </motion.h2>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Calendar Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1 min-h-0 bg-[#0a0a0f] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/60"
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.06] bg-white/[0.015] shrink-0">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="py-2.5 text-center text-[10px] sm:text-xs font-bold text-white/30 tracking-widest uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-[#07070a]/70 backdrop-blur-sm flex items-center justify-center rounded-2xl"
              >
                <div className="w-6 h-6 border-2 border-white/10 border-t-[#c9a96e] rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Cells */}
          <motion.div
            key={monthKey}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 min-h-0 grid grid-cols-7 auto-rows-fr overflow-hidden"
          >
            {daysInMonth.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const dayBookings = bookings.filter((b) =>
                isSameDay(new Date(b.startDateTime), day)
              );
              const todayDay = isToday(day);

              return (
                <motion.div
                  key={day.toISOString()}
                  variants={cellVariants}
                  onClick={() => openNewBooking(day)}
                  className={cn(
                    "border-b border-r border-white/[0.04] p-1.5 sm:p-2 relative group cursor-pointer transition-colors duration-150",
                    !isCurrentMonth && "bg-[#07070a]/40",
                    isCurrentMonth && "hover:bg-white/[0.025]",
                    todayDay && "bg-[#c9a96e]/[0.04]"
                  )}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] sm:text-xs font-semibold transition-all",
                      todayDay
                        ? "bg-[#c9a96e] text-[#07070a] shadow-[0_0_12px_rgba(201,169,110,0.4)]"
                        : isCurrentMonth
                        ? "text-white/65 group-hover:text-white/90"
                        : "text-white/15"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Add indicator on hover */}
                  <Plus className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3.5 h-3.5 text-[#c9a96e] opacity-0 group-hover:opacity-70 transition-opacity hidden sm:block" />

                  {/* Booking chips */}
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[72px] no-scrollbar">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={(e) => openEditBooking(booking, e)}
                        className={cn(
                          "px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium border transition-all hover:brightness-125 hover:scale-[1.01] active:scale-100 cursor-pointer",
                          booking.status === "Inquiry"
                            ? "bg-white/[0.04] border-white/10 text-white/75 border-l-2 border-l-white/30"
                            : booking.status === "Blocked"
                            ? "bg-red-500/10 border-red-500/20 text-red-300"
                            : "bg-[#c9a96e]/10 border-[#c9a96e]/20 text-[#c9a96e] border-l-2 border-l-[#c9a96e]/60"
                        )}
                      >
                        {/* Client name row */}
                        <div className="flex items-center gap-1 truncate">
                          {!booking.isFullDay && (
                            <Clock className="w-2.5 h-2.5 shrink-0 opacity-60" />
                          )}
                          <span className="truncate font-semibold">
                            {booking.clientName || booking.status}
                          </span>
                        </div>
                        {/* Location row — always show if available */}
                        {booking.location && (
                          <div className="flex items-center gap-1 mt-0.5 opacity-55 text-[9px] sm:text-[10px] truncate">
                            <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>

      {/* ── Booking Modal ── */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
        selectedDate={selectedDate}
        existingBookings={bookings}
        editingBooking={editingBooking}
      />
    </div>
  );
}
