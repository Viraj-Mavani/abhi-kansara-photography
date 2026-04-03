"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { detailedServices, servicesPageConfig } from "@/lib/services";
import type { DetailedService } from "@/lib/services";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
} as any;

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
} as any;

/* ─── Horizontal Scroll Ticker (for decorative effect) ─── */
function ScrollTicker() {
  const tickerItems = detailedServices.flatMap((s) => [s.title, "✦"]);
  const doubled = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden py-6 border-y border-slate-200/60 transition-colors duration-500">
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`text-sm tracking-[0.2em] uppercase font-bold ${
              item === "✦"
                ? "text-accent-gold text-xs"
                : "text-slate-500 transition-colors duration-500"
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Variant 1: Vertical Card with Image ─── */
function ServiceCardImage({
  service,
  index,
  onClick,
}: {
  service: DetailedService;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 border border-slate-100 transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Top: Image Area */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
        
        {/* Floating index */}
        <div className="absolute top-6 left-6">
          <span className="text-white/60 font-serif text-4xl sm:text-5xl font-bold leading-none drop-shadow-md select-none group-hover:text-white/80 transition-colors duration-500">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        
        {/* Category Overlay */}
        <div className="absolute bottom-6 left-8 flex items-center gap-3">
          {service.icon && (
            <span
              className="material-symbols-outlined text-accent-gold text-lg drop-shadow-md"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
            >
              {service.icon}
            </span>
          )}
          <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold drop-shadow-md">
            {service.category || "Service"}
          </span>
        </div>
      </div>

      {/* Bottom: Content Area */}
      <div className="relative flex flex-col flex-grow p-8 sm:p-10 transition-colors duration-500">
         {/* Title area */}
         <h3 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-3 leading-tight transition-colors duration-500 group-hover:text-accent-gold">
           {service.title}
         </h3>
         <p className="font-serif italic text-slate-500 text-sm mb-6 transition-colors duration-500">
           {service.tagline}
         </p>
         
         <div className="w-10 h-px bg-accent-gold/40 mb-6 group-hover:w-20 transition-all duration-700" />
         
         <p className="text-slate-600 text-sm font-light leading-relaxed mb-8 line-clamp-3 flex-grow">
           {service.shortDescription}
         </p>

         <div className="mt-auto">
           {/* Quick Stats & CTA Split */}
           <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              {service.startingPrice ? (
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold block mb-1">
                    {service.priceNote || "From"}
                  </span>
                  <span className="text-slate-800 font-serif text-xl group-hover:text-accent-gold transition-colors duration-300">
                    {service.startingPrice}
                  </span>
                </div>
              ) : (
                <div />
              )}
              <div className="inline-flex items-center gap-2 text-slate-900 text-[10px] uppercase tracking-[0.2em] font-bold group-hover:text-accent-gold transition-colors duration-300">
                  <span>Details</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
           </div>
         </div>
      </div>
    </motion.div>
  );
}

/* ─── Variant 2: Minimal Typographic Card (No Image) ─── */
function ServiceCardMinimal({
  service,
  index,
  onClick,
}: {
  service: DetailedService;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      className="relative group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-black/10 border border-slate-100 transition-all duration-700 flex flex-col h-full p-10 sm:p-14 xl:p-16 hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Background Watermark Index */}
      <div className="absolute -bottom-10 -right-8 pointer-events-none select-none transition-transform duration-[2s] group-hover:scale-110 opacity-30 group-hover:opacity-60">
        <span className="font-serif text-[180px] sm:text-[220px] font-bold leading-none text-slate-50 transition-colors duration-700 drop-shadow-xs">
           {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent-gold/10 to-transparent group-hover:via-accent-gold/40 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              {service.icon && (
                <span className="material-symbols-outlined text-accent-gold text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
                  {service.icon}
                </span>
              )}
              <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold">
                {service.category || "Service"}
              </span>
            </div>
            {/* Minimal Index top right */}
            <span className="text-slate-300 font-serif text-sm font-bold group-hover:text-accent-gold transition-colors duration-500">
              No. {String(index + 1).padStart(2, "0")}
            </span>
         </div>

         <h3 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-4 leading-tight transition-colors duration-500">
           {service.title}
         </h3>

         <div className="w-12 h-[2px] bg-accent-gold/40 mb-6 group-hover:w-24 group-hover:bg-accent-gold transition-all duration-700" />

         <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-10 line-clamp-4 flex-grow">
           {service.shortDescription}
         </p>
         
         <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12">
            {service.startingPrice && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold block mb-1">
                  {service.priceNote || "Investment"}
                </span>
                <span className="text-slate-800 font-serif text-2xl group-hover:text-accent-gold transition-colors duration-500">
                  {service.startingPrice}
                </span>
              </div>
            )}
            {service.minDuration && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold block mb-1">
                  Duration
                </span>
                <span className="text-slate-700 font-serif text-2xl transition-colors duration-500">
                  {service.minDuration}
                </span>
              </div>
            )}
         </div>

         <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 italic font-serif text-sm group-hover:text-slate-600 transition-colors duration-500">{service.tagline}</span>
            <div className="inline-flex items-center gap-3 text-accent-gold text-[11px] uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.25em] transition-all duration-500">
              <span>Explore</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
            </div>
         </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Services Showcase Component ─── */
export default function ServicesShowcase() {
  const [selectedService, setSelectedService] = useState<DetailedService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleOpenService = (service: DetailedService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 500);
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative h-[90vh] sm:h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500">
        <div className="absolute inset-0 bg-accent-ivory transition-colors duration-500">
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,0.1), transparent)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-accent-gold uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-6 block"
          >
            {servicesPageConfig.heroTagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl text-slate-900 leading-[1.05] mb-6 transition-colors duration-500"
          >
            {servicesPageConfig.heroTitle.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="italic text-slate-400">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed transition-colors duration-500"
          >
            {servicesPageConfig.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-3"
          >
            <span className="text-slate-500 text-[9px] uppercase tracking-[0.4em] font-bold transition-colors duration-500">
              Explore
            </span>
            <div className="w-px h-10 bg-slate-200 relative overflow-hidden transition-colors duration-500">
              <motion.div
                className="absolute top-0 left-0 w-full h-1/3 bg-accent-gold/60"
                animate={{ y: ["-100%", "300%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "circInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <ScrollTicker />

      {/* ── 2-Column Grid Variants for User Review ── */}
      <div className="bg-accent-ivory pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-accent-gold mb-2">Design Preview</h2>
            <p className="text-slate-600 text-sm">Please review both layout variants sequentially below.</p>
        </div>
      </div>

      {/* Variant 1: With Image */}
      <section className="relative w-full bg-accent-ivory transition-colors duration-500 pb-24 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
             <h3 className="font-serif text-3xl text-slate-800">Variant 1: Image & Typography</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
            {detailedServices
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .map((service, index, arr) => {
                 const isOddLast = arr.length % 2 !== 0 && index === arr.length - 1;
                 return (
                  <div 
                    key={`v1-${service.id}`} 
                    className={`w-full ${isOddLast ? 'md:col-span-2 md:max-w-md lg:max-w-xl' : ''}`}
                  >
                    <ServiceCardImage
                      service={service}
                      index={index}
                      onClick={() => handleOpenService(service)}
                    />
                  </div>
                 );
              })}
          </div>
        </div>
      </section>

      {/* Variant 2: Minimal Typography */}
      <section className="relative w-full bg-accent-ivory transition-colors duration-500 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
             <h3 className="font-serif text-3xl text-slate-800">Variant 2: Pure Typography</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
            {detailedServices
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .map((service, index, arr) => {
                 const isOddLast = arr.length % 2 !== 0 && index === arr.length - 1;
                 return (
                  <div 
                    key={`v2-${service.id}`} 
                    className={`w-full ${isOddLast ? 'md:col-span-2 md:max-w-md lg:max-w-xl xl:max-w-2xl' : ''}`}
                  >
                    <ServiceCardMinimal
                      service={service}
                      index={index}
                      onClick={() => handleOpenService(service)}
                    />
                  </div>
                 );
              })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative w-full bg-slate-50 border-t border-slate-200/50 py-20 sm:py-32 transition-colors duration-500">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block"
          >
            Ready?
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl text-slate-900 mb-6 transition-colors duration-500"
          >
            Let&apos;s Create <span className="italic text-slate-400">Together</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-10 font-light transition-colors duration-500"
          >
            Every great story starts with a conversation. Tell us about your vision.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href={servicesPageConfig.ctaLink}
              className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-accent-gold transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-accent-gold/20 group"
            >
              {servicesPageConfig.ctaText}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Service Details Modal ── */}
      <ServiceDetailsModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
