"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { portfolioImages } from "@/lib/data";

export default function PortfolioGrid() {
  return (
    <section id="works" className="relative w-full bg-transparent py-20 sm:py-32 z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-left mb-16 sm:mb-24">
          <span className="uppercase tracking-[0.2em] text-xs mb-4 block font-bold text-accent-gold">Portfolio</span>
          <h2 className="font-serif text-5xl sm:text-7xl font-medium text-white mix-blend-difference">
            Featured <span className="italic text-white/60">Works</span>
          </h2>
        </div>

        {/* 
          3x2 Grid (3 columns, 2 rows) = 6 photos 
          Using 2:3 ratio (aspect-[2/3] or h-full object-cover within controlled aspect ratio).
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioImages.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="relative w-full aspect-2/3 overflow-hidden group rounded-sm"
            >
              <Image
                src={project.src}
                alt={project.title || "Portfolio Project"}
                fill
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Subtle Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
                <span className="text-accent-gold text-xs uppercase tracking-widest font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {project.category}
                </span>
                <h3 className="text-white font-serif text-2xl sm:text-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
