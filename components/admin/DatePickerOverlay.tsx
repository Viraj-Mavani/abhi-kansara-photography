"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Date Picker Overlay
//  Premium glassmorphism Month (4×3 grid) + Year (wheel)
// ─────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

interface DatePickerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelect: (month: number, year: number) => void;
  initialFocus?: "month" | "year";
}

export default function DatePickerOverlay({
  isOpen,
  onClose,
  currentDate,
  onSelect,
  initialFocus = "month",
}: DatePickerOverlayProps) {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<"month" | "year">(initialFocus);

  const yearListRef = useRef<HTMLDivElement>(null);

  // Year range
  const startYear = currentYear - 5;
  const endYear = currentYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  // Scroll year into view reliably
  const scrollToYear = useCallback(() => {
    if (!yearListRef.current) return;
    const container = yearListRef.current;
    const yearEl = container.querySelector(`[data-year="${selectedYear}"]`) as HTMLElement;
    
    if (yearEl) {
      // Calculate exact center position
      const targetScroll = yearEl.offsetTop - (container.clientHeight / 2) + (yearEl.clientHeight / 2);
      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [selectedYear]);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedMonth(currentDate.getMonth());
      setSelectedYear(currentDate.getFullYear());
      setActiveTab(initialFocus);
    }
  }, [isOpen, currentDate, initialFocus]);

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    onSelect(monthIndex, selectedYear);
    onClose();
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    onSelect(selectedMonth, year);
    onClose();
  };

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 touch-none"
          data-lenis-prevent="true"
        >
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e16]/95 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white/90 tracking-wide uppercase">
                Jump to Date
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex px-5 pt-4 gap-1">
              <button
                onClick={() => setActiveTab("month")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === "month"
                    ? "bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setActiveTab("year")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === "year"
                    ? "bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                )}
              >
                Year
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {activeTab === "month" ? (
                  <motion.div
                    key="month-grid"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {MONTHS.map((name, i) => {
                      const isActive = i === selectedMonth;
                      const isCurrent = i === currentMonth && selectedYear === currentYear;
                      return (
                        <motion.button
                          key={name}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleMonthClick(i)}
                          className={cn(
                            "py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                            isActive
                              ? "bg-[#c9a96e] text-[#0a0a0f] border-[#c9a96e] shadow-[0_0_16px_rgba(201,169,110,0.3)] font-bold"
                              : isCurrent
                              ? "bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/30"
                              : "bg-white/[0.02] text-white/60 border-white/[0.06] hover:bg-white/[0.06] hover:text-white hover:border-white/15"
                          )}
                        >
                          {name}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="year-wheel"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    onAnimationComplete={scrollToYear}
                    ref={yearListRef}
                    className="h-[280px] overflow-y-auto overscroll-none snap-y snap-mandatory relative touch-auto no-scrollbar"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    data-lenis-prevent="true"
                  >
                    {/* Gradient masks for perspective */}
                    <div className="pointer-events-none sticky top-0 z-10 h-16 bg-gradient-to-b from-[#0e0e16] to-transparent" />
                    <div className="flex flex-col items-center gap-1 -mt-16 pb-16">
                      {years.map((year) => {
                        const isActive = year === selectedYear;
                        const isCurrent = year === currentYear;
                        const distance = Math.abs(year - selectedYear);
                        return (
                          <motion.button
                            key={year}
                            data-year={year}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleYearClick(year)}
                            className={cn(
                              "snap-center w-full py-3 rounded-xl text-center font-medium transition-all duration-200",
                              isActive
                                ? "text-[#c9a96e] text-2xl font-extrabold bg-[#c9a96e]/10 border border-[#c9a96e]/30 shadow-[0_0_16px_rgba(201,169,110,0.2)]"
                                : isCurrent
                                ? "text-white/70 text-lg"
                                : distance <= 2
                                ? "text-white/35 text-base hover:text-white/60 hover:bg-white/[0.03]"
                                : "text-white/15 text-sm hover:text-white/40 hover:bg-white/[0.03]"
                            )}
                          >
                            {year}
                          </motion.button>
                        );
                      })}
                    </div>
                    <div className="pointer-events-none sticky bottom-0 z-10 h-16 bg-gradient-to-t from-[#0e0e16] to-transparent -mt-16" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
