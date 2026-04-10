"use client";

import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, useMotionValueEvent } from "framer-motion";
import { DetailedService } from "@/lib/services";
import { useEffect, useState, useRef } from "react";

export default function LandingCarousel({ services }: { services: DetailedService[] }) {
  const duplicatedServices = [...services, ...services, ...services];
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setSingleSetWidth(containerRef.current.scrollWidth / 3);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(x, "change", (latest) => {
    if (singleSetWidth === 0) return;

    if (latest <= -singleSetWidth) {
      x.set(latest + singleSetWidth);
    }
    else if (latest > 0) {
      x.set(latest - singleSetWidth);
    }
  });

  useAnimationFrame((t, delta) => {
    if (isInteracting || singleSetWidth === 0) return;

    // carousel speed (pixels per millisecond)
    const speed = 0.05;

    x.set(x.get() - (speed * delta));
  });

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000); // Resumes the engine after 2 seconds
  };

  return (
    <section id="services" className="relative w-full py-24 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-12 flex flex-col items-start">
        <span className="text-accent-gold uppercase tracking-[0.2em] text-xs mb-4 block font-bold">Offerings</span>
        <h2 className="font-serif text-5xl sm:text-7xl font-medium text-white mix-blend-difference">
          Curated <span className="italic text-white/60">Services</span>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden shrink-0 flex items-center"
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
      >
        <motion.div
          ref={containerRef}
          style={{ x }}
          className="flex gap-4 cursor-grab active:cursor-grabbing w-max"
          drag="x"
          dragElastic={0}
          onDragStart={handleInteractionStart}
          onDragEnd={handleInteractionEnd}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
        >
          {duplicatedServices.map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className="relative w-[70vw] sm:w-[300px] h-[400px] sm:h-[450px] shrink-0 group overflow-hidden"
            >
              <Image
                src={service.coverImage}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 70vw, 400px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-white font-serif text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {service.title}
                </h3>
                <div className="w-8 h-px bg-accent-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}