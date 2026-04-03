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
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] },
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

/* ─── Individual Service Card ─── */
function ServiceCard({
  service,
  index,
  onClick,
}: {
  service: DetailedService;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 group cursor-pointer ${
        isEven ? "" : "lg:direction-rtl"
      }`}
      onClick={onClick}
    >
      {/* Image Side */}
      <div className={`relative w-full aspect-4/5 lg:aspect-auto lg:min-h-[600px] overflow-hidden ${isEven ? "order-1" : "order-1 lg:order-2"}`}>
        <Image
          src={service.coverImage}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

        {/* Mobile title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
          <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block font-sans">
            {service.category || "Service"}
          </span>
          <h3 className="font-serif text-3xl text-white mb-2 leading-tight">{service.title}</h3>
        </div>

        {/* Floating index number */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
          <span className="text-white/10 font-serif text-7xl lg:text-9xl font-bold leading-none group-hover:text-white/20 transition-all duration-700 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className={`relative flex flex-col justify-center p-8 sm:p-10 lg:p-14 xl:p-20 bg-white border-y border-slate-100 transition-colors duration-500 ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-6 right-6 w-12 h-px bg-accent-gold/40" />
          <div className="absolute top-6 right-6 h-12 w-px bg-accent-gold/40" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Category + Icon */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            {service.icon && (
              <span
                className="material-symbols-outlined text-accent-gold text-xl"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
              >
                {service.icon}
              </span>
            )}
            <span className="text-accent-gold uppercase tracking-[0.2em] text-[10px] font-bold hidden lg:inline">
              {service.category || "Service"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            variants={fadeUp}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 mb-4 leading-tight hidden lg:block transition-colors duration-500"
          >
            {service.title}
          </motion.h3>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="font-serif italic text-slate-500 text-sm sm:text-base mb-6 transition-colors duration-500"
          >
            {service.tagline}
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="w-10 h-px bg-accent-gold/40 mb-6 group-hover:w-20 transition-all duration-700"
          />

          {/* Short Description */}
          <motion.p
            variants={fadeUp}
            className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-md transition-colors duration-500"
          >
            {service.shortDescription}
          </motion.p>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
            {service.startingPrice && (
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold block mb-1">
                  {service.priceNote || "Price"}
                </span>
                <span className="text-accent-gold font-serif text-xl">
                  {service.startingPrice}
                </span>
              </div>
            )}
            {service.minDuration && (
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold block mb-1">
                  Duration
                </span>
                <span className="text-slate-700 font-serif text-xl transition-colors duration-500">
                  {service.minDuration}
                </span>
              </div>
            )}
            {service.packages.length > 0 && (
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold block mb-1">
                  Packages
                </span>
                <span className="text-slate-700 font-serif text-xl transition-colors duration-500">
                  {service.packages.length}
                </span>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-3 text-accent-gold text-xs uppercase tracking-[0.2em] font-bold group/cta cursor-pointer">
              <span className="group-hover/cta:tracking-[0.3em] transition-all duration-500">
                Explore Details
              </span>
              <ArrowRight
                size={14}
                className="group-hover/cta:translate-x-2 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </motion.div>
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
    // Delay nullifying service so exit animation can play
    setTimeout(() => setSelectedService(null), 500);
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative h-[90vh] sm:h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500">
        {/* Animated gradient background */}
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

          {/* Scroll indicator */}
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

      {/* ── Service Cards ── */}
      <section className="relative w-full bg-accent-ivory transition-colors duration-500 pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 lg:space-y-48">
          {detailedServices
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
            .map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onClick={() => handleOpenService(service)}
              />
            ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative w-full bg-accent-ivory py-20 sm:py-32 transition-colors duration-500">
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
