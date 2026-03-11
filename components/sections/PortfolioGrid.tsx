"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const portfolioProjects = [
  { id: "p1", title: "Aaina & Daideep", category: "Baby shower", src: "/images/wedding_ceremony_1773261191985.png", span: "row-span-2 col-span-1" },
  { id: "p2", title: "Sapan & Sajnee", category: "Baby shower", src: "/images/wedding_couple_portrait_1773261177325.png", span: "col-span-1 row-span-1" },
  { id: "p3", title: "Akshar & Meha", category: "Baby shower", src: "/images/wedding_reception_1773261219216.png", span: "col-span-1 row-span-1" },
  { id: "p4", title: "Vidhi & Kashyap", category: "Baby shower", src: "/images/wedding_hero_1773261165253.png", span: "col-span-2 row-span-2" },
  { id: "p5", title: "Priya & Preean", category: "Baby shower", src: "/images/wedding_details_1773261206723.png", span: "col-span-1 row-span-1" },
  { id: "p6", title: "Vidhi & Rushi", category: "Baby shower", src: "/images/wedding_couple_portrait_1773261177325.png", span: "col-span-1 row-span-1" },
];

export default function PortfolioGrid() {
  return (
    <section className="relative w-full bg-[#faefe5] py-32 sm:py-48 z-10 text-slate-900 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-16 sm:mb-24">
          <span className="uppercase tracking-[0.2em] text-xs mb-4 block font-bold text-slate-500">Portfolio</span>
          <h2 className="font-serif text-5xl sm:text-7xl font-medium">
            Featured <span className="italic">Works</span>
          </h2>
        </div>

        {/* Masonry-style CSS Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[250px] sm:auto-rows-[350px]">
          {portfolioProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className={`relative rounded-sm overflow-hidden group ${project.span}`}
            >
              {/* Clicks disabled for now */}
              <div className="w-full h-full cursor-not-allowed">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />
                
                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-accent-gold text-xs uppercase tracking-widest font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.category}</span>
                  <h3 className="text-white font-serif text-2xl sm:text-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{project.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
