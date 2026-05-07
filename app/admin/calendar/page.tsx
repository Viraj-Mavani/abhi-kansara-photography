"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, Calendar as CalendarIcon, Phone, MapPin, DollarSign, Clock } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { getAllBookings, createBookingAction, updateBookingAction, deleteBookingAction } from "@/app/actions/bookings";
import BookingModal, { Booking } from "@/components/admin/BookingModal";

// ─────────────────────────────────────────────────────────
//  Scheduling Hub — Standalone App Layout
//  Mobile-first custom calendar view with glassmorphism
// ─────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    // Find the Monday before the start of the month to fill the grid
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
    
    // Find the Sunday after the end of the month
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (7 - (endDate.getDay() === 0 ? 7 : endDate.getDay())));

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Actions
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

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
    <div className="min-h-screen bg-[#07070a] flex flex-col font-sans text-white/90 selection:bg-[#c9a96e]/30">
      
      {/* ── Standalone App Top Navigation ── */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">Back to Admin</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#c9a96e]" />
            Scheduling Hub
          </h1>
        </div>

        <button
          onClick={() => openNewBooking(new Date())}
          className="flex items-center gap-2 bg-[#c9a96e] hover:bg-[#d4b881] text-[#07070a] px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(201,169,110,0.15)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6 overflow-hidden">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          
          <div className="flex items-center gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-[#0a0a0f] border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-white/[0.08] bg-white/[0.02]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-white/40 tracking-widest uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-auto">
            {daysInMonth.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const dayBookings = bookings.filter((b) => isSameDay(new Date(b.startDateTime), day));

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => openNewBooking(day)}
                  className={cn(
                    "min-h-[100px] sm:min-h-[140px] border-b border-r border-white/[0.04] p-1.5 sm:p-3 relative group cursor-pointer transition-colors",
                    !isCurrentMonth && "bg-[#07070a]/50 text-white/20",
                    isCurrentMonth && "hover:bg-white/[0.02]"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs sm:text-sm font-medium transition-colors",
                        isToday(day) 
                          ? "bg-[#c9a96e] text-[#07070a] shadow-[0_0_15px_rgba(201,169,110,0.3)]" 
                          : isCurrentMonth ? "text-white/70" : "text-white/20"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    
                    {/* Hover indicator for "add" */}
                    <Plus className="w-4 h-4 text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                  </div>

                  {/* Booking Cards */}
                  <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[80px] sm:max-h-none no-scrollbar">
                    {dayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={(e) => openEditBooking(booking, e)}
                        className={cn(
                          "px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium border backdrop-blur-md transition-all hover:brightness-110",
                          booking.status === "Inquiry" 
                            ? "bg-white/[0.03] border-white/10 text-white/80 border-l-2 border-l-white/40" 
                            : booking.status === "Blocked"
                            ? "bg-red-500/10 border-red-500/20 text-red-200"
                            : "bg-[#c9a96e]/10 border-[#c9a96e]/20 text-[#c9a96e] border-l-2 border-l-[#c9a96e]"
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {!booking.isFullDay && <Clock className="w-3 h-3 shrink-0 opacity-70" />}
                          <span className="truncate">{booking.clientName || booking.status}</span>
                        </div>
                        {booking.status === "Confirmed" && booking.location && (
                          <div className="hidden sm:flex items-center gap-1 mt-1 opacity-60 text-[10px]">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ── Modal ── */}
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
