"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { DetailedService } from "@/lib/api";
import type { PageConfig } from "@/lib/api";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);
  return isMobile;
}

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
function ScrollTicker({ services }: { services: DetailedService[] }) {
  const tickerItems = services.flatMap((s) => [s.title, "✦"]);
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

/* ─── Minimal Typographic Card ─── */
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
  const isMobile = useIsMobile();
  const isCenter = useInView(cardRef, { margin: "-40% 0px -40% 0px" });
  const triggerHover = isMobile && isCenter;

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      className={`relative group cursor-pointer bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-700 flex flex-col h-full p-8 md:p-12 lg:p-14 xl:p-16 ring-1 ring-slate-100/50 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 data-[hovered=true]:shadow-2xl data-[hovered=true]:shadow-black/10 data-[hovered=true]:-translate-y-2`}
      data-hovered={triggerHover}
      onClick={onClick}
    >
      {/* Background Watermark Index */}
      <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-8 pointer-events-none select-none transition-transform duration-[2s] group-hover:scale-110 group-data-[hovered=true]:scale-110 opacity-20 group-hover:opacity-40 group-data-[hovered=true]:opacity-40">
        <span className="font-serif text-[140px] sm:text-[180px] lg:text-[220px] font-bold leading-none text-slate-100 transition-colors duration-700 drop-shadow-xs">
           {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent-gold/10 to-transparent group-hover:via-accent-gold/40 group-data-[hovered=true]:via-accent-gold/40 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-8 md:mb-10">
            <div className="flex items-center gap-2 md:gap-3">
              {service.icon && (
                <span className="material-symbols-outlined text-accent-gold text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
                  {service.icon}
                </span>
              )}
              <span className="text-accent-gold uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-bold">
                {service.category || "Service"}
              </span>
            </div>
            {/* Minimal Index top right */}
            <span className="text-slate-300 font-serif text-xs md:text-sm font-bold group-hover:text-accent-gold group-data-[hovered=true]:text-accent-gold transition-colors duration-500">
              No. {String(index + 1).padStart(2, "0")}
            </span>
         </div>

         <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-4 leading-tight transition-colors duration-500">
           {service.title}
         </h3>

         <div className="w-12 h-[2px] bg-accent-gold/40 mb-6 group-hover:w-24 group-data-[hovered=true]:w-24 group-hover:bg-accent-gold group-data-[hovered=true]:bg-accent-gold transition-all duration-700" />

         <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-10 line-clamp-4 flex-grow">
           {service.shortDescription}
         </p>
         
         {/* Removed Price and Duration for minimalist premium design */}

         <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <span className="text-slate-400 italic font-serif text-sm group-hover:text-slate-600 group-data-[hovered=true]:text-slate-600 transition-colors duration-500 max-w-[280px] sm:max-w-none">
              {service.tagline}
            </span>
            <div className="inline-flex items-center self-end sm:self-auto gap-3 text-accent-gold text-[11px] uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.25em] group-data-[hovered=true]:tracking-[0.25em] transition-all duration-500">
              <span>Explore</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 group-data-[hovered=true]:translate-x-2 transition-transform duration-300" />
            </div>
         </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Services Showcase Component ─── */
export default function ServicesShowcase({ services, pageConfig }: { services: DetailedService[], pageConfig: PageConfig }) {
  const [selectedService, setSelectedService] = useState<DetailedService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const isMobile = useIsMobile();

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
          className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col h-full w-full"
        >
          <div className="flex-grow flex flex-col justify-center items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-accent-gold uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-6 block"
            >
              {pageConfig?.heroTagline}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl text-slate-900 leading-[1.05] mb-6 transition-colors duration-500"
            >
              {pageConfig?.heroTitle?.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="italic text-slate-400">{word}</span>
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
              {pageConfig?.heroSubtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-auto pb-10 flex flex-col items-center gap-4"
          >
            <span className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-bold transition-colors duration-500">
              {isMobile ? "Swipe" : "Explore"}
            </span>
            <div className="w-px h-12 bg-slate-200 relative overflow-hidden transition-colors duration-500">
              <motion.div
                className="absolute top-0 left-0 w-full h-1/3 bg-accent-gold"
                animate={{ y: ["-100%", "300%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "circInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <ScrollTicker services={services} />

      {/* Our Services */}
      <section className="relative w-full bg-accent-ivory transition-colors duration-500 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 justify-items-center">
            {services
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .map((service, index, arr) => {
                 const isOddLast = arr.length % 2 !== 0 && index === arr.length - 1;
                 return (
                  <div 
                    key={`v2-${service.id}`} 
                    className={`w-full max-w-sm md:max-w-none ${isOddLast ? 'md:col-span-2 md:max-w-lg lg:max-w-xl' : ''}`}
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
              href={pageConfig?.ctaLink || "/contact"}
              className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-accent-gold transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-accent-gold/20 group"
            >
              {pageConfig?.ctaText || "Get in touch"}
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
