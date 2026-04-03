"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DetailedService } from "@/lib/services";
import { X, ChevronDown, Check, ArrowRight, Star } from "lucide-react";

interface ServiceDetailsModalProps {
  service: DetailedService | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.97,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
} as any;

const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
} as any;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
} as any;

/* Accordion Hook */
function useAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);
  return { openIndex, toggle };
}

export default function ServiceDetailsModal({
  service,
  isOpen,
  onClose,
}: ServiceDetailsModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const faqAccordion = useAccordion();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Reset scroll on open
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen, service?.id]);

  // Handle Back Button Interception
  useEffect(() => {
    if (!isOpen) return;

    // Push state when modal opens
    window.history.pushState({ modalOpen: true }, "");

    const handlePopState = () => {
      // If we are popping back, close the modal
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // If modal is unmounting but still has that history entry (e.g. closed via X)
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  if (!service) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Soft light backdrop */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

          {/* Modal Container */}
          <motion.div
            key={service.id}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-colors duration-500"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-50 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all duration-300 hover:rotate-90 group"
              aria-label="Close service details"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Scrollable Content */}
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[92vh] scroll-smooth overscroll-contain"
              style={{ scrollbarWidth: "none" }}
              data-lenis-prevent="true"
            >
              {/* ── Hero Banner ── */}
              <div className="relative w-full h-[45vh] sm:h-[50vh] overflow-hidden">
                <Image
                  src={service.coverImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Refined gradient for better text legibility on light theme */}
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-white/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/5 mix-blend-multiply" /> {/* Subtle darkening overlay */}

                {/* Hero Text */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="absolute bottom-8 left-8 sm:left-12 right-8 sm:right-12"
                >
                  <motion.span
                    variants={fadeUp}
                    className="inline-block text-accent-gold uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-3 drop-shadow-[0_1px_2px_rgba(255,255,255,1)]"
                  >
                    {service.category || "Service"}
                  </motion.span>
                  <motion.h2
                    variants={fadeUp}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.1] mb-3 transition-colors duration-500 drop-shadow-[0_1px_10px_rgba(255,255,255,0.8)]"
                  >
                    {service.title}
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    className="text-slate-600 text-sm sm:text-base max-w-xl italic font-serif transition-colors duration-500 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]"
                  >
                    {service.tagline}
                  </motion.p>
                  {service.startingPrice && (
                    <motion.div variants={fadeUp} className="mt-4 flex items-baseline gap-2">
                      {service.priceNote && (
                        <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold font-sans transition-colors duration-500 drop-shadow-[0_1px_2px_rgba(255,255,255,1)]">
                          {service.priceNote}
                        </span>
                      )}
                      <span className="text-accent-gold text-2xl sm:text-3xl font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,1)]">
                        {service.startingPrice}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* ── Body Content ── */}
              <div className="px-6 sm:px-12 py-10 sm:py-14 space-y-16 sm:space-y-20">
                {/* Overview + Features */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
                >
                  <motion.div variants={fadeUp}>
                    <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block font-sans">
                      Overview
                    </span>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light transition-colors duration-500">
                      {service.detailedDescription}
                    </p>

                    {/* Quick Highlights */}
                    {service.highlights && service.highlights.length > 0 && (
                      <div className="mt-8 grid grid-cols-2 gap-3">
                        {service.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 transition-colors duration-500"
                          >
                            <div className="h-2 w-2 rounded-full bg-accent-gold shrink-0" />
                            <span className="text-slate-700 text-xs font-medium transition-colors duration-500">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block font-sans">
                      What's Included
                    </span>
                    <ul className="space-y-3">
                      {service.features.map((f, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 group"
                        >
                          <div className="mt-1 h-5 w-5 rounded-full border border-accent-gold/20 flex items-center justify-center group-hover:bg-accent-gold/10 transition-colors duration-300 shrink-0">
                            <Check size={10} className="text-accent-gold" strokeWidth={2.5} />
                          </div>
                          <span className="text-slate-600 text-sm font-light transition-colors duration-500">{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                {/* ── Packages / Pricing ── */}
                {service.packages.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeUp} className="mb-10">
                      <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 block font-sans">
                        Packages
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 transition-colors duration-500">
                        Choose Your <span className="italic text-slate-500">Experience</span>
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {service.packages.map((pkg, i) => (
                        <motion.div
                          key={pkg.name}
                          variants={fadeUp}
                          className={`relative p-6 sm:p-8 rounded-xl border transition-all duration-500 group hover:border-accent-gold/40 shadow-sm hover:shadow-md
                            ${
                              pkg.isPopular
                                ? "bg-accent-gold/2 border-accent-gold/30"
                                : "bg-slate-50/50 border-slate-100"
                            }
                          `}
                        >
                          {pkg.isPopular && (
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-accent-gold text-black text-[9px] uppercase tracking-[0.2em] font-bold rounded-full">
                              Most Popular
                            </div>
                          )}
                          <div className="mb-6">
                            <h4 className="text-slate-900 text-lg font-medium mb-1 transition-colors duration-500">{pkg.name}</h4>
                            {pkg.duration && (
                              <span className="text-slate-500 text-xs uppercase tracking-widest font-bold font-sans transition-colors duration-500">
                                {pkg.duration}
                              </span>
                            )}
                          </div>
                          {pkg.price && (
                            <div className="mb-1">
                              <span className="text-accent-gold font-serif text-3xl">
                                {pkg.price}
                              </span>
                            </div>
                          )}
                          {pkg.priceNote && (
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold block mb-4 font-sans transition-colors duration-500">
                              {pkg.priceNote}
                            </span>
                          )}
                          {pkg.description && (
                            <p className="text-slate-600 text-xs mb-6 font-light leading-relaxed transition-colors duration-500">
                              {pkg.description}
                            </p>
                          )}
                          <ul className="space-y-2.5">
                            {pkg.deliverables.map((d, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-slate-600 text-xs transition-colors duration-500">
                                <Check
                                  size={12}
                                  className="text-accent-gold shrink-0 mt-0.5"
                                  strokeWidth={2.5}
                                />
                                <span>
                                  {d.item}
                                  {d.detail && (
                                    <span className="text-slate-500 ml-1 transition-colors duration-500">— {d.detail}</span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add-Ons */}
                    {service.addOns && service.addOns.length > 0 && (
                      <motion.div variants={fadeUp} className="mt-12">
                        <span className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-4 block font-sans transition-colors duration-500">
                          Available Add-Ons
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {service.addOns.map((a, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-white border border-slate-100 rounded-full px-5 py-2.5 hover:border-accent-gold/40 hover:shadow-sm transition-all duration-300"
                            >
                              <span className="text-slate-600 text-xs font-medium transition-colors duration-500">{a.name}</span>
                              {a.price && (
                                <span className="text-accent-gold text-xs font-medium">
                                  +{a.price}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ── Process / Timeline ── */}
                {service.process.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeUp} className="mb-10">
                      <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 block font-sans">
                        The Journey
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 transition-colors duration-500">
                        How It <span className="italic text-slate-500 transition-colors duration-500">Works</span>
                      </h3>
                    </motion.div>

                    <div className="relative">
                      {/* Vertical timeline line */}
                      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-gold/40 via-accent-gold/20 to-transparent hidden sm:block" />

                      <div className="space-y-8 sm:space-y-10">
                        {service.process.map((step, i) => (
                          <motion.div
                            key={step.step}
                            variants={fadeUp}
                            className="flex items-start gap-5 sm:gap-8 group"
                          >
                            {/* Step circle */}
                            <div className="relative shrink-0">
                              <div className="h-10 w-10 rounded-full border border-accent-gold/20 bg-white flex items-center justify-center group-hover:border-accent-gold group-hover:bg-accent-gold/5 transition-all duration-500 shadow-sm">
                                {step.icon ? (
                                  <span className="material-symbols-outlined text-accent-gold text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                                    {step.icon}
                                  </span>
                                ) : (
                                  <span className="text-accent-gold text-xs font-bold">
                                    {String(step.step).padStart(2, "0")}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="-mt-0.5">
                              <h4 className="text-slate-900 text-base sm:text-lg font-medium mb-1 group-hover:text-accent-gold transition-colors duration-300">
                                {step.title}
                              </h4>
                              <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed max-w-md transition-colors duration-500">
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Gallery ── */}
                {service.galleryImages.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeUp} className="mb-8">
                      <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 block font-sans">
                        Gallery
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 transition-colors duration-500">
                        Recent <span className="italic text-slate-500 transition-colors duration-500">Work</span>
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {service.galleryImages.map((img, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          className="relative aspect-[4/5] overflow-hidden rounded-md group"
                        >
                          <Image
                            src={img}
                            alt={`${service.title} gallery ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Testimonials ── */}
                {service.testimonials && service.testimonials.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeUp} className="mb-8">
                      <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 block font-sans">
                        Kind Words
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 transition-colors duration-500">
                        Client <span className="italic text-slate-500 transition-colors duration-500">Love</span>
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {service.testimonials.map((t, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          className="p-6 sm:p-8 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors duration-500"
                        >
                          {t.rating && (
                            <div className="flex gap-1 mb-4">
                              {Array.from({ length: t.rating }).map((_, s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className="text-accent-gold fill-accent-gold"
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-slate-600 text-sm font-light leading-relaxed italic mb-4 transition-colors duration-500">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                          <div>
                            <span className="text-slate-900 text-sm font-medium transition-colors duration-500">
                              {t.clientName}
                            </span>
                            {t.event && (
                              <span className="text-slate-500 text-xs ml-2 transition-colors duration-500">{t.event}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── FAQs (Accordion) ── */}
                {service.faqs.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={fadeUp} className="mb-8">
                      <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3 block font-sans">
                        FAQ
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 transition-colors duration-500">
                        Common <span className="italic text-slate-500 transition-colors duration-500">Questions</span>
                      </h3>
                    </motion.div>

                    <div className="space-y-2">
                      {service.faqs.map((faq, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          className="border border-slate-100 bg-white rounded-lg overflow-hidden mb-2 shadow-sm transition-colors duration-500"
                        >
                          <button
                            onClick={() => faqAccordion.toggle(i)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors duration-300"
                          >
                            <span className="text-slate-800 text-sm font-medium pr-4 transition-colors duration-500">
                              {faq.question}
                            </span>
                            <motion.div
                              animate={{ rotate: faqAccordion.openIndex === i ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown
                                size={16}
                                className="text-accent-gold shrink-0 transition-colors duration-500"
                                strokeWidth={1.5}
                              />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {faqAccordion.openIndex === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-5 text-slate-500 text-sm font-light leading-relaxed transition-colors duration-500">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── CTA ── */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center py-8"
                >
                  <p className="text-slate-500 text-sm mb-6 font-light transition-colors duration-500">
                    Ready to create something beautiful?
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-accent-gold transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-accent-gold/20 group"
                  >
                    Book This Experience
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
