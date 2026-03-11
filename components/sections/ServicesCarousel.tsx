"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  { id: 1, title: "Wedding", image: "/images/wedding_ceremony_1773261191985.png" },
  { id: 2, title: "Pre-Wedding", image: "/images/wedding_couple_portrait_1773261177325.png" },
  { id: 3, title: "Events", image: "/images/wedding_reception_1773261219216.png" },
  { id: 4, title: "Baby Shower", image: "/images/wedding_hero_1773261165253.png" },
  { id: 5, title: "Product", image: "/images/wedding_details_1773261206723.png" },
  { id: 6, title: "Editorial", image: "/images/wedding_couple_portrait_1773261177325.png" },
];

export default function ServicesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-[#1a1a1a] py-32 sm:py-48 z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-16 flex justify-between items-end">
        <div>
          <span className="text-accent-gold uppercase tracking-[0.2em] text-sm mb-4 block font-bold">Offerings</span>
          <h2 className="font-serif text-5xl sm:text-6xl text-white">Curated <span className="italic text-white/60">Services</span></h2>
        </div>
        
        {/* Navigation Buttons based on the HTML reference */}
        <div className="hidden sm:flex gap-4">
          <button 
            onClick={scrollLeft}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 sm:gap-8 px-6 sm:px-12 pb-12 snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="min-w-[70vw] sm:min-w-[400px] h-[500px] sm:h-[600px] relative shrink-0 snap-center group overflow-hidden"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-white font-serif text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {service.title}
                </h3>
                <div className="w-8 h-px bg-accent-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
