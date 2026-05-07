"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, MapPin, User, AlertCircle, Clock, FileText, Phone, Mail, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  Booking Modal
//  Mobile-optimized slide-up drawer / centered modal for PC
// ─────────────────────────────────────────────────────────

type BookingStatus = "Inquiry" | "Confirmed" | "Blocked";

export interface Booking {
  id?: string;
  clientName: string;
  location?: string;
  startDateTime: string;
  endDateTime?: string;
  eventType?: string;
  isFullDay: boolean;
  status: BookingStatus;
  notes?: string;
  phoneNumber?: string;
  email?: string;
  amountProposed?: number;
  paymentReceived?: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => Promise<void>;
  selectedDate: Date | null;
  existingBookings: Booking[];
  editingBooking?: Booking | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  existingBookings,
  editingBooking,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [formData, setFormData] = useState<Booking>({
    clientName: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    eventType: "Gold",
    isFullDay: false,
    status: "Inquiry",
    notes: "",
    phoneNumber: "",
    email: "",
    amountProposed: undefined,
    paymentReceived: undefined,
  });

  // Pre-fill form when opened
  useEffect(() => {
    if (editingBooking) {
      setFormData(editingBooking);
    } else if (selectedDate) {
      // Format to YYYY-MM-DDTHH:mm
      const tzOffset = selectedDate.getTimezoneOffset() * 60000;
      const localISOTime = new Date(selectedDate.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);
      
      setFormData({
        clientName: "",
        location: "",
        startDateTime: localISOTime,
        endDateTime: "",
        eventType: "Gold",
        isFullDay: false,
        status: "Inquiry",
        notes: "",
        phoneNumber: "",
        email: "",
        amountProposed: undefined,
        paymentReceived: undefined,
      });
    }
  }, [editingBooking, selectedDate, isOpen]);

  // Conflict Checking Logic
  useEffect(() => {
    if (!formData.startDateTime) {
      setConflictWarning(null);
      return;
    }

    const start = new Date(formData.startDateTime);
    // Default end time to +2 hours if not set
    const end = formData.endDateTime 
      ? new Date(formData.endDateTime) 
      : new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const hasConflict = existingBookings.some((b) => {
      // Ignore self when editing
      if (editingBooking && b.id === editingBooking.id) return false;

      const bStart = new Date(b.startDateTime);
      const bEnd = b.endDateTime 
        ? new Date(b.endDateTime) 
        : new Date(bStart.getTime() + 2 * 60 * 60 * 1000);

      // Overlap condition: A.start < B.end AND B.start < A.end
      return start < bEnd && bStart < end;
    });

    if (hasConflict) {
      setConflictWarning("⚠️ Conflict: Abhi already has a booking at this time.");
    } else {
      setConflictWarning(null);
    }
  }, [formData.startDateTime, formData.endDateTime, existingBookings, editingBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save booking. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#0a0a0f] border border-white/[0.08] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <h2 className="text-lg font-medium text-white/90">
            {editingBooking ? "Edit Booking" : "New Booking"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 #0a0a0f" }}>
          {conflictWarning && (
            <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-200/90 leading-relaxed">
                {conflictWarning}
                <p className="mt-1 text-orange-200/60 text-xs">You can still proceed, but please verify schedule.</p>
              </div>
            </div>
          )}

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* ── Status & Type ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/50 transition-all outline-none appearance-none"
                >
                  <option value="Inquiry">Inquiry (Tentative)</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Blocked">Blocked (Personal)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Theme / Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#c9a96e] focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/50 transition-all outline-none appearance-none"
                >
                  <option value="Gold">Gold (Premium)</option>
                  <option value="Silver">Silver</option>
                  <option value="Minimal">Minimal (White)</option>
                </select>
              </div>
            </div>

            {/* ── Client Details ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/70 border-b border-white/10 pb-2">Client Details</h3>
              
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  required
                  type="text"
                  placeholder="Client Name *"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/50 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={formData.phoneNumber || ""}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email (Optional)"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Event Details ── */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-white/70 border-b border-white/10 pb-2">Event Details</h3>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Location (Optional)"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="isFullDay"
                  checked={formData.isFullDay}
                  onChange={(e) => setFormData({ ...formData, isFullDay: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-offset-0"
                />
                <label htmlFor="isFullDay" className="text-sm text-white/70 select-none cursor-pointer">
                  All-Day Event
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> Start</label>
                  <input
                    required
                    type={formData.isFullDay ? "date" : "datetime-local"}
                    value={formData.startDateTime.slice(0, formData.isFullDay ? 10 : 16)}
                    onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c9a96e]/50 transition-all outline-none color-scheme-dark"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> End (Optional)</label>
                  <input
                    type={formData.isFullDay ? "date" : "datetime-local"}
                    value={formData.endDateTime?.slice(0, formData.isFullDay ? 10 : 16) || ""}
                    onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c9a96e]/50 transition-all outline-none"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Payment Info ── */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-white/70 border-b border-white/10 pb-2">Payment Info</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    placeholder="Total Price"
                    value={formData.amountProposed || ""}
                    onChange={(e) => setFormData({ ...formData, amountProposed: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a96e]/70" />
                  <input
                    type="number"
                    placeholder="Paid so far"
                    value={formData.paymentReceived || ""}
                    onChange={(e) => setFormData({ ...formData, paymentReceived: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full bg-[#c9a96e]/[0.02] border border-[#c9a96e]/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-white/50 flex items-center gap-2"><FileText className="w-3.5 h-3.5"/> Notes</label>
              <textarea
                rows={3}
                placeholder="Internal notes..."
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/50 transition-all outline-none resize-none"
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/[0.08] bg-white/[0.01] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 font-medium text-sm hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="booking-form"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-[#c9a96e] text-[#0a0a0f] font-bold text-sm hover:bg-[#d4b881] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#0a0a0f]/20 border-t-[#0a0a0f] rounded-full animate-spin" />
            ) : (
              <CalendarIcon className="w-4 h-4" />
            )}
            {editingBooking ? "Save Changes" : "Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
